import express from "express"
import connect from "./utilits/connect.js"
import {config} from "dotenv"
import authRoutes from "./routes/auth.route.js"
import messageRoute from "./routes/Message.route.js"
import cors from "cors"
import cookieParser from "cookie-parser"
import {v2 as cloudinary} from "cloudinary"
import {app, http, io} from "./controllers/message.controller.js"

const PORT = 4000;
config()
app.use(cors({
  origin: "https://redord.onrender.com",
  credentials: true
}))
app.use(express.json({limit: "10mb"}))
app.use(cookieParser())

cloudinary.config({
  cloud_name: "ddmvyw1of",
  api_key: "828494828935913",
  api_secret: "SEoHBbPrIRVA7Qn6lH-QzucnlXU",
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
app.use("/api/messages", messageRoute)


// socket implimentation


http.listen(PORT, () => {
  console.log("server started on ", PORT)
})