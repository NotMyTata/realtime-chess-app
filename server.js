import { instrument } from '@socket.io/admin-ui';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import next from 'next';

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer, {
    cors: {
      origin: ['https://admin.socket.io'],
      credentials: true,
    }
  });

  io.on("connection", client => {

    client.on("join-room", roomId => {
      client.join(roomId);
      console.log("Successfully joined room: " + roomId);
    });

    client.on("leave-room", roomId => {
      client.leave(roomId);
      console.log("Successfully leave room: " + roomId);
    });

    client.on("make-move", roomId => {
      
    });

    client.on("send-message", roomId => {
      //emit receive-message to client roomid
    });
  });

  instrument(io, { 
    auth: false,
   });

  httpServer.listen(port, () => {
    console.log(`Server is up on: http://${hostname}:${port}`)
  });
})