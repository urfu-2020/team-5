// const WebSocket = require('ws');
const { Server } = require('socket.io');
const dbapi = require('../db/dbapi');
const Message = require('../../client/src/models/message');

/**
 * Настраиваем сокеты
 * @param server {Server}
 */
function configureSocket(server) {
  // const io = new WebSocket.Server({ server });
  const io = new Server(server);

  io.on('connection', (socket) => {
    socket.on('setUserId', (userId) => {
      // eslint-disable-next-line no-param-reassign
      socket.userId = userId;
    });

    socket.on('setChats', (chatIds) => {
      chatIds.forEach((chatId) => socket.join(chatId));
    });

    socket.on('chatMessage', async ({
      chatId, text, hasAttachments, status, time
    }) => {
      console.log('sender uid', socket.userId);
      const senderId = socket.userId;
      const messageId = await dbapi.storeChatMessage({
        chatId, senderId, text, hasAttachments, status, time
      });

      const resultMessage = new Message(messageId, chatId, senderId, text, hasAttachments, status, time);
      console.log(resultMessage);
      io.in(chatId).emit('chatMessage', resultMessage);
    });
  });
}

module.exports = { configureSocket };
