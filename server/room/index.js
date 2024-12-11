import { v4 as uuidV4 } from "uuid";

const rooms = {};

export const roomHanlder = (socket) => {
  const createRoom = () => {
    const roomId = uuidV4();
    rooms[roomId] = [];
    socket.emit("room-created", { roomId });
    console.log("new room created");
  };
  //   join room event

  const joinRoom = ({ roomId, peerId }) => {
    console.log(
      `new user with peer id ${peerId} joined room and roomId is ${roomId}`
    );
    if (rooms[roomId]) {
      rooms[roomId].push(peerId);
      socket.join(roomId);

      socket.to(roomId).emit("user-joined", { peerId });
      socket.emit("get-users", {
        roomId,
        participants: rooms[roomId],
      });
    }
    socket.emit("get-users", rooms);
  };

  function getAllUsers() {
    console.log("emitting all users", rooms);
    socket.emit("get-users", { rooms });
  }
  const startSharing = ({ peerId, roomId }) => {
    socket.to(roomId).emit("user-started-sharing", peerId);
  };

  const stopSharing = (roomId) => {
    socket.to(roomId).emit("user-stop-sharing");
  };

  // socket events
  socket.on("create-room", createRoom);

  //   join room event.
  socket.on("join-room", joinRoom);

  // get all users
  socket.on("get-users", getAllUsers);
  socket.on("start-sharing", startSharing);
  socket.on("stop-sharing", stopSharing);
};
