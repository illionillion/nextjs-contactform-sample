import type { NextApiRequest, NextApiResponse } from "next";
import type { Server as HTTPServer } from "http";
import type { Socket as NetSocket } from "net";
import { Server as IOServer } from "Socket.IO";
import { ClientToServerEvents, ServerToClientEvents } from "@/lib/@types/models";

interface SocketServer extends HTTPServer {
  io?: IOServer | undefined;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}

export default function socketHandler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new IOServer<ClientToServerEvents, ServerToClientEvents>(res.socket.server);
    res.socket.server.io = io;

    // コネクション確立
    io.on("connection", (socket) => {
      console.log(socket.id);

      socket.on("onSubmit", () => {
        console.log(`from client: onSubmit`);
        io.emit("sync");
      });

      // 切断イベント受信
      socket.on("disconnect", (reason) => {
        console.log(`user disconnected. reason is ${reason}.`);
      });
    });
  }
  res.end();
}
