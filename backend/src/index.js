import express from "express"
import connect from "./utilits/connect.js"
import {config} from "dotenv"
import authRoutes from "./routes/auth.route.js"
import messageRoute from "./routes/Message.route.js"
import cors from "cors"
import cookieParser from "cookie-parser"
import {v2 as cloudinary} from "cloudinary"
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const http = createServer(app);
const io = new Server(http, {
  cors: {
    origin: "*",
  }
})
const PORT = 4000;
config()
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}))
app.use(express.json({limit: "10mb"}))
app.use(cookieParser())

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const originalLOG = console.log;
const originalERROR = console.error;

console.log =  function (...arg) {
  originalLOG('\x1b[36m%s\x1b[0m', `[LOG]`, ...arg)
}

console.error = function (...arg) {
  originalERROR('\x1b[31m%s\x1b[0m', `[Error]`, ...arg)
}
connect()

app.use("/api/auth", authRoutes)
app.use("/api/message", messageRoute)

http.listen(PORT, () => {
  console.log("server started on ", PORT)
})