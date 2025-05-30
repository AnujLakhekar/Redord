import express from "express"
import {logout, getMe, login, googleLogin ,signup} from "../controllers/auth.controller.js"
import ProtectRoute from "../middleware/ProtectRoute.js"
const router = express.Router();


router.get("/me", ProtectRoute , getMe);
router.post("/login", login);
router.post("/signup", signup);
router.post('/google', googleLogin);
router.post('/logout', logout);


export default router