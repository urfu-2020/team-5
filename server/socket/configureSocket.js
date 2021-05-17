const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');
const session = require('../session');
const {
  getUserLastChatMessages, getUserChats, addDialogsWithNewUser, storeChatMessage
} = require('../db/dbapi');

/**
 * chatId -> members
 * @type {{
 *   number: Array<WebSocket>
 * }}
 */
const rooms = {};

const sendToRoomMembers = (chatId, message) => {
  rooms[chatId].forEach((client) => {
    console.log('send to ', client.sessionUser.username);
    client.send(message);
  });
};

const connectUserToRooms = (socket, chats) => {
  chats.forEach((chat) => {
    const { chatId } = chat;
    if (rooms[chatId]) {
      rooms[chatId].push(socket);
    } else {
      rooms[chatId] = [socket];
    }
  });
};

/**
 * Настраиваем сокеты
 * @param server {Server}
 */
function configureSocket(server) {
  const io = new WebSocket.Server({ noServer: true });

  server.on('upgrade', (req, socket, head) => {
    io.handleUpgrade(req, socket, head, async (ws) => {
      session(req, {}, () => {
        ws.sessionUser = req.session.passport.user;
        io.emit('connection', ws);
      });
    });
  });

  io.on('connection', async (socket) => {
    const { sessionUser } = socket;
    let userChats = await getUserChats(sessionUser.id);

    // Если у пользователя еще нет чатов (даже с собой), значит это новый пользователь
    if (userChats.length === 0) {
      await addDialogsWithNewUser(sessionUser.username);
      userChats = await getUserChats(sessionUser.id);
      connectUserToRooms(socket, userChats);

      io.clients.forEach((client) => {
        if (client !== socket) {
          const newUserChat = userChats.find((chat) => chat.sobesednikId === client.sessionUser.id);
          client.send(JSON.stringify({
            type: 'addNewDialog',
            // схема чата из бд
            payload: {
              ...newUserChat,
              sobesednikId: sessionUser.id,
              sobesednikUsername: sessionUser.username,
              sobesednikAvatarUrl: sessionUser.avatarUrl,
              sobesednikGHUrl: sessionUser.githubUrl
            }
          }));
          rooms[newUserChat.chatId].push(client);
        }
      });
    } else connectUserToRooms(socket, userChats);

    const lastMessages = await getUserLastChatMessages(sessionUser.id);
    socket.send(JSON.stringify({
      type: 'setChatsData',
      payload: { userChats, lastMessages }
    }));

    socket.on('message', async (rawMessage) => {
      const message = JSON.parse(rawMessage);
      console.log(message);
      switch (message.type) {
        case 'chatMessage': {
          const {
            chatId, text, hasAttachments, status, time
          } = message.payload;

          const senderId = sessionUser.id;
          if (rooms[chatId] && rooms[chatId].includes(socket)) {
            const id = uuidv4();
            const resultMessage = {
              id, chatId, senderId, text, hasAttachments, status, time
            };
            storeChatMessage(resultMessage);
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
      console.log('close');
      Object.entries(rooms).forEach(([roomId, sockets]) => {
        if (sockets.includes(socket)) {
          rooms[roomId] = sockets.filter((client) => client !== socket);
          if (rooms[roomId].length === 0) delete rooms[roomId];
        }
      });
    });
  });
}

module.exports = configureSocket;
