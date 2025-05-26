// authController.js
import mongoose from "mongoose";
import User from "../models/User.model.js";
import { OAuth2Client } from "google-auth-library";
import bcrypt from "bcryptjs";
import generateToken from "../utilits/token.js";
import { v4 as uuid } from "uuid";
import {v2 as cloudinary} from "cloudinary"

function generateNumericSeed() {
  return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
}

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ message: "Internal server error", error: e.message });
  }
};

export const signup = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    
    const seed = generateNumericSeed()
    const avatar = `https://api.dicebear.com/7.x/shapes/svg?seed=${seed}`
    
    var minNumberofChars = 6;
    var maxNumberofChars = 16;
    
    if (!email.includes("@")) {
      return res.status(400).json({
        message: "Invalid email Format"
      })
    }
    
    
    if (password.length < minNumberofChars) {
      return res.status(400).json({
        message: "Password should be of minimun 6 charectars"
      })
    } else if (password.length > maxNumberofChars) {
      return res.status(400).json({
        message: "Password should be less than 16 charectars"
    })}
    
 if (!/[0-9]/.test(password)) {
    return res.status(400).json({ message: "Password must include at least one number." });
  }

  if (!/[!@#$%^&*]/.test(password)) {
   return res.status(400).json({ message: "Password must include at least one special character (!@#$%^&*)." });
    
  }

  if (/[^a-zA-Z0-9!@#$%^&*]/.test(password)) {
    return res.status(400).json({ message: "Password contains invalid characters." });
  }


    if (!email || !username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: "Username or Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      googleId: uuid(),
      email,
      username,
      avatar,
      password: hashedPassword,
      discriminator: "",
    });

    await newUser.save();
  const token =  generateToken(res, newUser._id);

    res.status(201).json({
      message: {
        client: {
          username: newUser.username,
          email: newUser.email,
          avatar: newUser.avatar,
          joinedAt: newUser.joinedAt,
          roles: newUser.roles,
          token: token
        },
      },
    });
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ message: "Internal server error", error: e.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

   const token =  generateToken(res, user._id);

    res.status(200).json({
      message: {
        client: {
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          joinedAt: user.joinedAt,
          roles: user.roles,
          token: token
        },
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { sub: googleId, email, name, picture } = ticket.getPayload();

    let user = await User.findOne({ googleId });
    
    let avatarImage;
    
    if (!user) {
      const imageRes = await fetch(picture)
      const arrayBuffer = await imageRes.arrayBuffer();
      const base64Image = Buffer.from(arrayBuffer, "binary").toString("base64")
      
      
      const uploadRes = await cloudinary.uploader.upload(
      `data:image/jpeg;base64,${base64Image}`);
      
      avatarImage = uploadRes.secure_url
      
    }
    

    if (!user) {
      user = await User.create({
        googleId,
        email,
        username: name,
        avatar: avatarImage,
        discriminator: Math.floor(1000 + Math.random() * 9000).toString(),
      });
    }

   const token = generateToken(res, user._id);

    res.status(200).json({ message: {
        client: {
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          joinedAt: user.joinedAt,
          roles: user.roles,
          token: token
        },
      }, });
  } catch (err) {
    console.error(err.message);
    res.status(401).json({ message: "Invalid token", error: err.message });
  }
};

