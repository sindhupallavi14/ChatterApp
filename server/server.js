import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import ChatModel from "./chat.schema.js";
import connectDB from "./mongoose.js";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let connectedUsers = new Map(); // key: socket.id, value: { username, online }

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("join", (username) => {
    socket.username = username;
    connectedUsers.set(socket.id, { name: username, online: true });

    // Notify all clients about the new user
    io.emit("user_joined", { username: socket.username });
    // Emit current user list to all clients
    io.emit("user_list", Array.from(connectedUsers.values()));

    // Send previous messages
    ChatModel.find()
      .sort({ timestamp: 1 })
      .limit(50)
      .then((messages) => {
        socket.emit("previous_messages", messages);
      });

    io.emit("welcome_msg", {
      message: `Welcome ${username}!`,
    });
  });

  socket.on("new_message", (msg) => {
    const ts = Date.now();

    const userMessage = {
      username: socket.username,
      message: typeof msg === "string" ? msg : msg.message,
      timestamp: ts,
    };

    // Save to DB
    const newChat = new ChatModel({
      username: socket.username,
      message: userMessage.message,
      timestamp: userMessage.timestamp,
    });
    newChat.save();

    // Broadcast to others
    socket.broadcast.emit("broadcast_message", userMessage);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    if (socket.username) {
      // Notify all clients about the user leaving
      io.emit("user_disconnected", { username: socket.username });
    }
    connectedUsers.delete(socket.id);
    // Update user list for everyone
    io.emit("user_list", Array.from(connectedUsers.values()));
  });

  socket.on("typing", () => {
    socket.broadcast.emit("user_typing", { username: socket.username });
  });

  socket.on("stop_typing", () => {
    socket.broadcast.emit("user_stopped_typing", { username: socket.username });
  });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});