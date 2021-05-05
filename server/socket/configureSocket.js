// const WebSocket = require('ws');
const { Server } = require('socket.io');
const Message = require('../../client/src/models/message');
const { storeChatMessage } = require('../db/dbapi');

/**
 * Настраиваем сокеты
 * TODO переписать на чистые сокеты без socket.io
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
      const senderId = socket.userId;
      const messageId = await storeChatMessage({
        chatId, senderId, text, hasAttachments, status, time
      });

      const resultMessage = new Message(messageId, chatId, senderId, text, hasAttachments, status, time);
      io.in(chatId.toString()).emit('chatMessage', resultMessage);
    });
  });
}

module.exports = { configureSocket };
