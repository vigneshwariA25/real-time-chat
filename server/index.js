// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");
// const cors = require("cors");

// // App create
// const app = express();
// app.use(cors());

// // HTTP server create
// const server = http.createServer(app);

// // Socket.IO setup
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5177",
//     methods: ["GET", "POST"],
//   },
// });

// // User connect aagumbodhu
// io.on("connection", (socket) => {
//   console.log("User connected:", socket.id);

//   // User join room
//   socket.on("join_room", (room) => {
//     if (!room) return;
//     socket.join(room);
//     console.log(`User ${socket.id} joined room ${room}`);
//   });

//   // Message receive
//   socket.on("send_message", (data) => {
//     if (!data?.room) return;
//     socket.to(data.room).emit("receive_message", data);
//   });

//   // Typing indicator
//   socket.on("typing", ({ room, username }) => {
//     if (!room) return;
//     socket.to(room).emit("show_typing", username);
//   });

//   // User disconnect
//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);
//   });
// });

// // Server listen
// server.listen(5000, () => {
//   console.log("Server running on port 5000");
// });


const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

// App create
const app = express();
app.use(cors());

// HTTP server create
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5177",
    methods: ["GET", "POST"],
  },
});

// ✅ ADD: room-wise users store
let roomUsers = {};

// User connect aagumbodhu
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // User join room
  socket.on("join_room", (room) => {
    if (!room) return;
    socket.join(room);
    console.log(`User ${socket.id} joined room ${room}`);
  });

  // ✅ ADD: user joined (ONLINE USERS)
  socket.on("user_joined", ({ room, username }) => {
    if (!room || !username) return;

    socket.username = username;
    socket.room = room;

    if (!roomUsers[room]) {
      roomUsers[room] = [];
    }

    // duplicate avoid
    if (!roomUsers[room].includes(username)) {
      roomUsers[room].push(username);
    }

    // send online users list
    io.to(room).emit("online_users", roomUsers[room]);
  });

  // Message receive
  socket.on("send_message", (data) => {
    if (!data?.room) return;
    socket.to(data.room).emit("receive_message", data);
  });

  // Typing indicator
  socket.on("typing", ({ room, username }) => {
    if (!room) return;
    socket.to(room).emit("show_typing", username);
  });

  // User disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    // ✅ ADD: remove user from online list
    const { room, username } = socket;

    if (room && username && roomUsers[room]) {
      roomUsers[room] = roomUsers[room].filter(
        (user) => user !== username
      );

      io.to(room).emit("online_users", roomUsers[room]);
    }
  });
});

// Server listen
server.listen(5000, () => {
  console.log("Server running on port 5000");
});
