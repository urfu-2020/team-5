const WebSocket = require('ws');
const Message = require('../../client/src/models/message');
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

/**
 * Настраиваем сокеты
 * @param server {Server}
 */
function configureSocket(server) {
  const io = new WebSocket.Server({ server });

  io.on('connection', (socket) => {
    socket.on('message', (rawMessage) => {
      const message = JSON.parse(rawMessage);

      switch (message.type) {
        case 'setUserId': {
          socket.userId = message.payload;
          break;
        }

        case 'setChats': {
          const chatIds = message.payload;
          chatIds.forEach((chatId) => {
            if (rooms[chatId]) {
              rooms[chatId].push(socket);
            } else {
              rooms[chatId] = [socket];
            }

            /* потом
            rooms[chatId].members.forEach((client) => {
              if (client.userId !== socket.userId) client.send('setMemberOnline');
            }); */
          });

          socket.chatIds = chatIds;
          break;
        }

        case 'chatMessage': {
          const {
            messageId, chatId, senderId, text, hasAttachments, status, time
          } = message.payload;

          storeChatMessage({
            messageId, chatId, senderId, text, hasAttachments, status, time
          });

          const resultMessage = new Message(messageId, chatId, senderId, text, hasAttachments, status, time);
          sendToRoomMembers(chatId, JSON.stringify({
            type: 'chatMessage', payload: resultMessage
          }));
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

module.exports = { configureSocket };
