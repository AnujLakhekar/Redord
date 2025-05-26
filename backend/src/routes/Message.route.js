import express from "express"
import * as controller from "../controllers/message.controller.js"
import ProtectRoute from "../middleware/ProtectRoute.js"
const router = express.Router();


router.get("/me", ProtectRoute , getMe);



export default router