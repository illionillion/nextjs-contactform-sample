import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
//モデル読み込み
import { ClientToServerEvents, ServerToClientEvents } from "./models";

const app = express();
const httpServer = createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents>(
  httpServer,
  //CORS対策
  {
    cors: {
      origin: [
        "http://localhost:3000",
        "http://localhost:3000/form-contents",
        ],
    },
  }
);
// コネクション確立
io.on("connection", (socket) => {
  console.log(socket.id);

  socket.on("onSubmit", () => {
    console.log(`from client: onSubmit`);
    socket.emit("sync");
  });

  // 切断イベント受信
  socket.on("disconnect", (reason) => {
    console.log(`user disconnected. reason is ${reason}.`);
  });
});

// サーバーを3001番ポートで起動
httpServer.listen(3001, () => {
  console.log("Server start on port 3001.");
});
