import * as express from 'express';
import { createServer } from "node:http";
import { Server, Socket } from 'socket.io';

const PORT = 5000;

const app = express();
const server = createServer(app);
const io = new Server(server);

// 연결된 객체
const connectionIDs: { [key: string]: string } = {};

io.on('connection', (socket: Socket) => {

  // 연결 생성
  socket.on('create_connection', (id: string) => {
    if(connectionIDs[id]) {
      socket.emit('error', '이미 존재하는 ID 입니다.');
      return;
    }

    connectionIDs[id] = socket.id;
    socket.join(id);

    console.info(`연결: 신규 연결 생성 ${id}, ${socket.id}`);
    socket.emit('create', `연결: ${id} 신규 연결 준비`);
  });

  // 연결 시도
  socket.on('attempt_connection', (id: string) => {
    if(!connectionIDs[id]) {
      socket.emit('error', '존재하지 않는 id 입니다.');
      return;
    }

    socket.join(id);
    console.info(`연결: 참여 성공 ${id}, ${socket.id}`);
    socket.emit('connection', `연결: ${id} 참여 성공`);
    io.to(id).emit('connection', `사용자 디버깅 연결 완료`);
  });

  // 메시지 전달
  socket.on('send_message', ({ id, message }: { id: string, message: string }) => {
    io.to(id).emit('receive_message', { message, from: socket.id });
    console.log(`${id}에 메시지 전달 (${socket.id}: ${message})`);
  });

  // 연결 종료 (객체 비우기)
  socket.on('disconnect', () => {
    for (const id in connectionIDs) {
      if (connectionIDs[id] === socket.id) {
        delete connectionIDs[id];
        io.to(id).emit('closed', `연결종료`);
        break;
      }
    }
  })
})

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
