import { io } from 'socket.io-client';

const PORT = 5000;
const TEST_ID = 'testkey1';

const socket = io(`http://localhost:${PORT}`);

// SDK
const createConnection = () => {
  socket.emit('create_connection', TEST_ID);

  socket.on('create', (message: string) => {
    console.info(`create: ${message}`);
  });

  socket.on('connection', (message: string) => {
    console.info(`connection: ${message}`);
  });
}

// devtools
const attemptConnection = () => {
  socket.emit('attempt_connection', TEST_ID);

  socket.on('connection', (message: string) => {
    console.info(`connection: ${message}`);
  });
}
