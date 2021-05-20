const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');
const session = require('../session');
const {
  getUserLastChatMessages, getUserChats, addDialogsWithNewUser, storeChatMessage
} = require('../db/dbapi');
const {
  rooms, connectUserToRooms, configureRoomsHeartbeat, sendToRoomMembers, leaveAllRooms
} = require('./socketRooms');

/**
 * Настраиваем сокеты
 * @param server {Server}
 */
function configureSocket(server) {
  const io = new WebSocket.Server({ noServer: true });
  const heartbeatInterval = configureRoomsHeartbeat(60 * 1000);

  server.on('upgrade', (req, socket, head) => {
    io.handleUpgrade(req, socket, head, async (ws) => {
      session(req, {}, () => {
        ws.sessionUser = req.session.passport.user;
        io.emit('connection', ws);
      });
    });
  });

  io.on('connection', async (socket) => {
    socket.isAlive = true;
    const { sessionUser } = socket;
    let userChats = await getUserChats(sessionUser.id);

    // Если у пользователя еще нет чатов (даже с собой), значит это новый пользователь
    if (userChats.length === 0) {
      await addDialogsWithNewUser(sessionUser.username);
      userChats = await getUserChats(sessionUser.id);
      connectUserToRooms(socket, userChats);
      // всем, кто сейчас онлайн, отправляем диалог с новым пользователем
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

    // при подключении пользователя отсылаем ему начальные данные о его чатах
    const lastMessages = await getUserLastChatMessages(sessionUser.id);
    socket.send(JSON.stringify({
      type: 'setChatsData',
      payload: { userChats, lastMessages }
    }));

    socket.on('message', async (rawMessage) => {
      const message = JSON.parse(rawMessage);
      switch (message.type) {
        case 'pong': {
          socket.isAlive = true;
          break;
        }

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
      leaveAllRooms(socket);
    });

    socket.on('error', (e) => {
      console.log('error', e);
    });
  });

  io.on('close', () => {
    clearInterval(heartbeatInterval);
  });
}

module.exports = configureSocket;
