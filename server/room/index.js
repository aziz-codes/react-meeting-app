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
    console.log("new user joined with id of ", peerId);
    if (rooms[roomId]) {
      rooms[roomId].push(peerId);
      socket.join(roomId);

      socket.to(roomId).emit("user-joined", peerId);
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

  // socket events
  socket.on("create-room", createRoom);

  //   join room event.
  socket.on("join-room", joinRoom);

  // get all users
  socket.on("get-users", getAllUsers);
};
