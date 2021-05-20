/**
 * chatId -> [{Websocket + sessionUser}]
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

const leaveAllRooms = (socket) => {
  Object.entries(rooms).forEach(([roomId, sockets]) => {
    if (sockets.includes(socket)) {
      rooms[roomId] = sockets.filter((client) => client.sessionUser.id !== socket.sessionUser.id);
      if (rooms[roomId].length === 0) delete rooms[roomId];
    }
  });
};

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
