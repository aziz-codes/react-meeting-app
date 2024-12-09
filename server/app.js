import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { roomHanlder } from "./room/index.js";

const PORT = 8000;

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["POST", "GET"],
  },
});

io.on("connection", (socket) => {
  console.log("new user is connected");
  roomHanlder(socket);
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(PORT, () => console.log("server is running on port 8000"));
