import express from "express"
import * as controller from "../controllers/message.controller.js"
import ProtectRoute from "../middleware/ProtectRoute.js"
import Messages from "../models/Message.model.js";
import {io, onlineUsers} from "../controllers/message.controller.js"
import Servers from "../models/Server.model.js"
import User from "../models/User.model.js"


const router = express.Router();



router.post("/:id", ProtectRoute , async (req, res) => {
  try {
    const currentUserId = await User.findById(req.user._id).select("-password");
    const secondUserId = await User.find({googleId: req.params.id}).select("-password");
    
    if (!currentUserId || !secondUserId) return res.status(400).json({
      message: "unauthorize chat id's"
    })
    
    if (currentUserId.chats.includes(currentUserId) && currentUserId.chats.includes(secondUserId) ) {
      return;
    };
    
    currentUserId.chats[{
      from: currentUserId,
      to: secondUserId,
      content: [{
      }]
    }]
  
    
    const Msg = await Messages.find().sort({createdAt: 1})
    
    res.status(200).json({
      message: Msg
    })
    
  } catch (e) {
    console.log(e.message)
  }
})

router.post("/delete/:id", ProtectRoute , async (req,res) => {
  try {
    const {id} = req.params;
    const user = req.user;
    
    if (!user) return res.status(400).json({
      message: "unauthorized token"
    })
    
    const msg = await Messages.findOneAndDelete({_id: id})
    
    console.log(msg)
  
  } catch (e) {
    
  }
})

router.get("/online", ProtectRoute , (req, res) => {
  try {
    
    const user = req.user;
    
    if (!user) return res.status(400).json({
      message: "unauthorized token"
    })
    
    res.status(200).json({message: Object.values(onlineUsers)})
  } catch (e) {
    console.log("Error in message route ", e.message)
  }
})





export default router