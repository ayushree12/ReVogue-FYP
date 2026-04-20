const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const { signAccessToken } = require('../utils/token');

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST']
    }
  });

  io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error('Authentication required'));
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (err) {
      next(err);
    }
  });

  io.on('connection', (socket) => {
    socket.on('conversation:join', ({ conversationId }) => {
      if (!conversationId) return;
      socket.join(conversationId);
    });

    socket.on('message:send', async (payload) => {
      try {
        const conversation = await Conversation.findById(payload.conversationId);
        if (!conversation) return;
        const message = await Message.create({
          conversationId: conversation._id,
          senderId: socket.user.id,
          text: payload.text
        });
        conversation.messages.push(message._id);
        await conversation.save();
        io.to(conversation._id.toString()).emit('message:new', message);
      } catch (err) {
        console.error('Socket error', err);
      }
    });
  });
};

module.exports = {
  initSocket,
  getSocket: () => io
};
