const WebSocket = require('ws');
const session = require('../session');
const { validateNewChat, validateNewChannel, sendError } = require('./socketUtils');
const {
  createAndGetNewChatGroup, createAndGetMessage, createAndGetChannel,
  getUserChats, getUserChatsChatUserRecords, addUsersInChat,
  getUserLastChatMessages, addDialogsWithNewUser, joinToChat, leaveFromChat
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

  // При апгрейде на сокеты прокидываем объект сессии
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
      const chatUserRecords = await getUserChatsChatUserRecords(sessionUser.id);

      // всем, кто сейчас онлайн, отправляем диалог с новым пользователем
      io.clients.forEach((client) => {
        if (client !== socket) {
          // для client находим его чат с новым пользователем
          const chatUser = chatUserRecords.find(
            (cu) => cu.userId === client.sessionUser.id
          );
          const dialogWithNewUser = userChats.find((chat) => chat.id === chatUser.chatId);

          // модель чата для фронта
          const chat = {
            ...dialogWithNewUser,
            chatTitle: sessionUser.username,
            chatAvatarUrl: sessionUser.avatarUrl,
            members: [client.sessionUser, sessionUser]
          };

          client.send(JSON.stringify({
            type: 'addNewChat',
            payload: { chat }
          }));
          rooms[dialogWithNewUser.id].push(client);
        }
      });
    } else connectUserToRooms(socket, userChats);

    // при подключении пользователя отсылаем ему начальные данные о его чатах
    const chatUserRecords = await getUserChatsChatUserRecords(sessionUser.id);
    const lastMessages = await getUserLastChatMessages(sessionUser.id);
    socket.send(JSON.stringify({
      type: 'setChatsData',
      payload: { userChats, chatUserRecords, lastMessages }
    }));

    socket.on('message', async (rawMessage) => {
      const message = JSON.parse(rawMessage);
      switch (message.type) {
        case 'pong': {
          socket.isAlive = true;
          break;
        }

        case 'createNewChannel': {
          const { channelTitle, channelDescription } = message.payload;
          const validateObj = await validateNewChannel(channelTitle, channelDescription);
          if (validateObj.error) {
            sendError(socket, validateObj);
          }
          const newChannel = await createAndGetChannel(channelTitle, channelDescription, sessionUser.id);

          joinToChat(newChannel.id, sessionUser.id);
          socket.send(JSON.stringify({
            type: 'addNewChat',
            payload: { chat: { ...newChannel, members: [sessionUser], owner: sessionUser } }
          }));
          break;
        }

        case 'createNewChat': {
          const { chatTitle, selectedUsers } = message.payload;
          const validateObj = await validateNewChat(chatTitle, selectedUsers);
          if (validateObj.error) {
            sendError(socket, validateObj);
          }
          const newChat = await createAndGetNewChatGroup(chatTitle, sessionUser.id);
          const chatId = newChat.id;
          const allUsers = [sessionUser, ...selectedUsers];
          // тут еще проверять что все юзеры есть в бд
          await addUsersInChat(chatId, allUsers);
          const chat = {
            ...newChat,
            members: allUsers,
            owner: sessionUser
          };
          io.clients.forEach((client) => {
            // Если клиент есть в комнате
            if (allUsers.find((user) => user.id === client.sessionUser.id)) {
              client.send(JSON.stringify({
                type: 'addNewChat',
                payload: { chat }
              }));

              if (!rooms[chatId]) rooms[chatId] = [];
              rooms[chatId].push(client);
            }
          });
          break;
        }

        case 'chatMessage': {
          const {
            chatId, text, hasAttachments, status, time
          } = message.payload;
          const senderId = sessionUser.id;
          // Если пользователь есть в чате, то сохраняем сообщение в бд и отсылаем его в этот чат
          if (rooms[chatId] && rooms[chatId].includes(socket)) {
            const resultMessage = await createAndGetMessage({
              chatId, senderId, text, hasAttachments, status, time
            });
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
