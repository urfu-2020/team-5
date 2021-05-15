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
    socket.on('setChats', (chatIds) => {
      chatIds.forEach((chatId) => {
        socket.join(chatId);
      });
    });

    socket.on('chatMessage', async ({
      messageId, chatId, senderId, text, hasAttachments, status, time
    }) => {
      await storeChatMessage({
        messageId, chatId, senderId, text, hasAttachments, status, time
      });

      const resultMessage = new Message(messageId, chatId, senderId, text, hasAttachments, status, time);
      io.in(chatId.toString()).emit('chatMessage', resultMessage);
    });
  });
}

module.exports = { configureSocket };
