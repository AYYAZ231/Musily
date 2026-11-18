const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// In-memory party rooms
const rooms = new Map();

app.get('/', (req, res) => {
  res.json({
    status: 'Musily Party Server Online 🔥',
    activeRooms: rooms.size,
    timestamp: Date.now()
  });
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Host creates room
  socket.on('CREATE_ROOM', ({ roomCode, hostName }) => {
    socket.join(roomCode);
    const room = {
      id: roomCode,
      name: `${hostName}'s Party Room`,
      hostSocketId: socket.id,
      auxOwnerId: socket.id,
      isPlaying: false,
      currentTrack: null,
      playbackPosition: 0,
      dropMode: false,
      queue: [],
      participants: [{ id: socket.id, name: hostName, isHost: true, hasAux: true }]
    };
    rooms.set(roomCode, room);
    socket.emit('ROOM_CREATED', room);
  });

  // Guest joins room
  socket.on('JOIN_ROOM', ({ roomCode, userName }) => {
    const room = rooms.get(roomCode);
    if (!room) {
      socket.emit('ERROR', 'Room not found');
      return;
    }
    socket.join(roomCode);
    const participant = { id: socket.id, name: userName, isHost: false, hasAux: false };
    room.participants.push(participant);
    io.to(roomCode).emit('SYNC_STATE', room);
  });

  // Aux holder updates playback
  socket.on('UPDATE_PLAYBACK', ({ roomCode, state }) => {
    const room = rooms.get(roomCode);
    if (!room) return;
    Object.assign(room, state);
    socket.to(roomCode).emit('SYNC_STATE', room);
  });

  // Reactions burst (🔥 🎉 🔊 ❤️ 💃 ⚡)
  socket.on('SEND_REACTION', ({ roomCode, emoji, senderName }) => {
    io.to(roomCode).emit('REACTION', { emoji, senderName, timestamp: Date.now() });
  });

  // Chat message
  socket.on('SEND_CHAT', ({ roomCode, text, senderName }) => {
    io.to(roomCode).emit('CHAT', { text, senderName, timestamp: Date.now() });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Musily Party Server running on port ${PORT}`);
});
