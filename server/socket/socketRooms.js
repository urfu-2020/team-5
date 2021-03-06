/**
 * Объект чатов вида
 * chatId -> [{Websocket + sessionUser}]
 * @type {{
 *   number: Array<WebSocket>
 * }}
 */
const rooms = {};

/**
 * Отправить сообщения всем в комнате
 * @param chatId {number}
 * @param message {string}
 */
const sendToRoomMembers = (chatId, message) => {
  rooms[chatId].forEach((client) => {
    client.send(message);
  });
};

/**
 * Подсоедениться к сокет румам или создать их, если такой еще не было
 * @param socket {WebSocket} сокет, который присоединяется к комнатам
 * @param {UserModel} socket.sessionUser объект сессии сокета
 * @param chatIds {Array<number>}
 */
const connectUserToRooms = (socket, chatIds) => {
  chatIds.forEach((chatId) => {
    if (rooms[chatId]) {
      rooms[chatId].push(socket);
    } else {
      rooms[chatId] = [socket];
    }
  });
};

/**
 * Покинуть все сокет румы (при отключении сокета)
 * @param socket {WebSocket} сокет, который покидает комнаты
 * @param {UserModel} socket.sessionUser объект сессии сокета
 */
const leaveAllRooms = (socket) => {
  Object.entries(rooms).forEach(([roomId, sockets]) => {
    if (sockets.includes(socket)) {
      rooms[roomId] = sockets.filter((client) => client.sessionUser.id !== socket.sessionUser.id);
      if (rooms[roomId].length === 0) delete rooms[roomId];
    }
  });
};

/**
 * Пинг-понг веб сокетов чтобы отслеживать, отрубать и выкидывать из комнат отвалившиеся сокеты
 * @param delay {number} задержка интервала
 * @returns {number} timerId
 */
const configureRoomsHeartbeat = (delay) => setInterval(() => {
  const pingedUsers = new Set();
  Object.values(rooms).forEach((sockets) => {
    sockets.forEach((ws) => {
      if (!pingedUsers.has(ws)) {
        if (ws.isAlive === false) {
          leaveAllRooms(ws);
          return ws.terminate();
        }
        ws.isAlive = false;
        ws.send(JSON.stringify({ type: 'ping' }));
        pingedUsers.add(ws);
      }
    });
  });
}, delay);

module.exports = {
  rooms,
  sendToRoomMembers,
  connectUserToRooms,
  leaveAllRooms,
  configureRoomsHeartbeat
};
