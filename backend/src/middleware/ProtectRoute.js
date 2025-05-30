import User from "../models/User.model.js";
import jwt from "jsonwebtoken";

const ProtectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    console.log(token)
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No Token Provided" });
    }

    const decoded = jwt.verify(token, "e4cf55640048b035a38ab139a3656abcbbe22f3eb30b2ad74888884247d5bf2dce4b892c87b3153ec03d6e15442e80b7e9f187687ae1bcb98de64e24202770b52ef9cdfcd8a10ec6e9822f996c1850a2add9c2422fa94734c978234b95c1fce6");
    
    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized: Invalid Token" });
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.log("Error in protectRoute middleware", err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default ProtectRoute;
