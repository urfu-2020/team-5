const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');
const session = require('../session');
const { getUserLastChatMessages } = require('../db/dbapi');
const { getUserChats } = require('../db/dbapi');
const { getUserByName } = require('../db/dbapi');
const { storeChatMessage } = require('../db/dbapi');

/**
 * chatId -> members
 * @type {{
 *   number: Array<WebSocket>
 * }}
 */
const rooms = {};

const sendToRoomMembers = (chatId, message) => {
  rooms[chatId].forEach((client) => {
    client.send(message);
  });
};

const setUserChats = (socket, chats) => {
  socket.chatIds = [];
  chats.forEach((chat) => {
    const { chatId } = chat;
    if (rooms[chatId]) {
      rooms[chatId].push(socket);
    } else {
      rooms[chatId] = [socket];
    }
    socket.chatIds.push(chatId);
  });
};

// це не нравится, очень долго
// пока что буду хранить в сокете айди чатов, в которых он есть (это тоже не нравится тк дублирование данных)
// const getUserChatsId = (userId) => Object.values(rooms)
//   .filter((chat) => chat.find((socket) => socket.userId === userId));

/**
 * Настраиваем сокеты
 * @param server {Server}
 */
function configureSocket(server) {
  const io = new WebSocket.Server({ noServer: true });

  server.on('upgrade', async (request, socket, head) => {
    session(request, {}, () => {
      io.handleUpgrade(request, socket, head, (ws) => {
        ws.username = request.session.passport.user.username;
        io.emit('connection', ws);
      });
    });
  });

  io.on('connection', async (socket) => {
    const userInDb = await getUserByName(socket.username);
    if (userInDb) {
      const userId = userInDb.id;
      socket.userId = userId;
      const rawChatsInfo = await getUserChats(userId);
      const lastMessages = await getUserLastChatMessages(userId);
      setUserChats(socket, rawChatsInfo);
      socket.send(JSON.stringify({ type: 'setChatsData', payload: { rawChatsInfo, lastMessages } }));
    }

    socket.on('message', (rawMessage) => {
      const message = JSON.parse(rawMessage);
      switch (message.type) {
        case 'chatMessage': {
          const {
            chatId, text, hasAttachments, status, time
          } = message.payload;

          const senderId = socket.userId;
          if (socket.chatIds.find((id) => id === chatId)) {
            const messageId = uuidv4();
            storeChatMessage({
              messageId, chatId, senderId, text, hasAttachments, status, time
            });

            const resultMessage = {
              id: messageId, chatId, senderId, text, hasAttachments, status, time
            };
            sendToRoomMembers(chatId, JSON.stringify({
              type: 'chatMessage', payload: resultMessage
            }));
          }
          break;
        }

        default: {
          break;
        }
      }
    });

    socket.on('close', () => {
      if (socket.chatIds) {
        socket.chatIds.forEach((chatId) => {
          const { userId } = socket;
          rooms[chatId] = rooms[chatId].filter((client) => client.userId !== userId);
          if (rooms[chatId].length === 0) delete rooms[chatId];
          // потом + наверное стоит отправлять не в каждый чат по отдельности, а как-нибудь сразу
          // sendToRoomMembers(chatId, { type: 'setUserOffline', payload: { chatId, userId } });
        });
      }
    });
  });
}

module.exports = configureSocket;
