const express = require('express');
const useSocket = require("socket.io");
const cors = require('cors');

const PORT = process.env.PORT || 9999

const app = express();
const server = require('http').Server(app);
const io = useSocket(server, {
  cors: {
    origin: '*',
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, './client/build')));
const rooms = new Map();

app.get('/room/:id', (req, res) => {
  const roomId = req.params.id;
  const response = rooms.has(roomId)
    ? {
      users: [...rooms.get(roomId).get('users').values()],
      messages: [...rooms.get(roomId).get('messages').values()],
    }
    : {
      users: [],
      messages: []
    };
  res.json(response);
});

app.post('/rooms', (req, res) => {
  const {roomId, userName} = req.body;

  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Map([
      ['users', new Map()],
      ['messages', []],
    ]));
  }
  res.json([...rooms.keys()]);
});

io.on('connection', socket => {
  socket.on('ROOM:JOIN', ({roomId, userName}) => {
    socket.join(roomId);
    rooms.get(roomId).get('users').set(socket.id, userName);
    const users = [...rooms.get(roomId).get('users').values()];
    socket.to(roomId).emit('ROOM:JOINED', users);
  });
  socket.on('disconnect', () => {
    rooms.forEach((value, roomId) => {
      if (value.get('users').delete(socket.id)) {
        const users = [...rooms.get(roomId).get('users').values()];
        socket.to(roomId).emit('ROOM:LEAVE', users);
      }
    });
  });
  socket.on('ROOM:NEW_MESSAGE', ({roomId, userName, text}) => {
    const newMessage = {
      userName,
      text
    }
    console.log(roomId);
    console.log('new message', newMessage);
    rooms.get(roomId).get('messages').push(newMessage);
    socket.to(roomId).emit('ROOM:ADD_NEW_MESSAGE', newMessage);
  });

  console.log('socket  connected', socket.id);
});

server.listen(PORT, (error) => {
  if (error) {
    throw Error(error);
  }

  console.log('Server has been started');
});
