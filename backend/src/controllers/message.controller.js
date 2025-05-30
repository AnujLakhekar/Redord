import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import User from "../models/User.model.js";
import Messages from "../models/Message.model.js";
import {config} from "dotenv"

config()
const app = express();
const http = createServer(app);
const io = new Server(http, {
  cors: {
    origin: ["https://redord.onrender.com", "http://localhost:3000", "https://redord.vercel.app"],
  },
});

io.setMaxListeners(100);

let onlineUsers = {};

io.on("connection", async (s) => {
  const id = s.handshake.query.user;
  
  console.log("user connected", s.id)
  
  s.emit("online_users_found", Object.values(onlineUsers)); 


  const userFromMongo = await User.findById(id);
  if (!userFromMongo) return;

  // Save online user info
  if (!(id in onlineUsers)) {
    onlineUsers[id] = {
      googleId: userFromMongo.googleId,
      username: userFromMongo.username,
      avatar: userFromMongo.avatar,
      email: userFromMongo.email,
    };
  }

  s.on("online_users", () => {
  s.emit("online_users_found", Object.values(onlineUsers)); 

  });

  s.on("send_message", async (msg) => {
    const newMsg = new Messages({
      user: {
        name: userFromMongo.username,
        avatar: userFromMongo.avatar,
      },
      content: msg,
    });

    await newMsg.save();

    io.emit("receive_message", newMsg); // broadcast
  });

  s.on("disconnect", () => {
    if (id in onlineUsers) {
      delete onlineUsers[id];
    }
    
    console.log("user disconnected", s.id)
  
    s.emit("online_users_found", Object.values(onlineUsers));
  });
});

export { app, http, io, onlineUsers };
