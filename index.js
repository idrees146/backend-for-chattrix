const http = require('http');
const socketIo = require('socket.io');

// Create HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Socket.io Server Running');
});

// Attach Socket.io to the server
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",  // React Vite URL
    methods: ["GET", "POST"]
  }
});

const users = {};

io.on('connection', (socket) => {
  socket.on('new-user-joined', (name) => {
    users[socket.id] = name;
    socket.broadcast.emit('user-joined', name);
  });

  socket.on('send', (message) => {
    socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('user-left', users[socket.id]);
    delete users[socket.id];
  });
});

server.listen(8000, () => {
  console.log('Socket.io server running on http://localhost:8000');
});
