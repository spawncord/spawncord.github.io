const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

// haha this is great security :3
const bannedIPs = new Set();

io.on('connection', (socket) => {
  const ip = socket.handshake.headers['x-forwarded-for'] || socket.handshake.address;

  socket.on('set-username', (username) => {
    const cleanIp = ip.startsWith('::ffff:') ? ip.replace('::ffff:', '') : ip;
    console.log(`${username} : ${cleanIp}`);
    socket.username = username;
    socket.ip = cleanIp;
  });

  socket.on('chat message', (data) => {
    if (socket.ip && bannedIPs.has(socket.ip)) {
      socket.emit('blocked', { reason: 'Your IP is banned' });
      console.log('Attempted message send from', socket.ip, ":", socket.username);
      return;
    }

    io.emit('chat message', data);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const repl = require('repl');

repl.start({
  prompt: 'server> ',
  eval: (cmd, context, filename, callback) => {
    try {
      const result = eval(cmd);
      callback(null, result);
    } catch (err) {
      callback(err);
    }
  }
});