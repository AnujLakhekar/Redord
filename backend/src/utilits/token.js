import jwt from "jsonwebtoken"

function genrateToken(res, userId) {
  const token = jwt.sign({userId}, "e4cf55640048b035a38ab139a3656abcbbe22f3eb30b2ad74888884247d5bf2dce4b892c87b3153ec03d6e15442e80b7e9f187687ae1bcb98de64e24202770b52ef9cdfcd8a10ec6e9822f996c1850a2add9c2422fa94734c978234b95c1fce6", {
    expiresIn: "15d",
  });
  
  res.cookie("jwt", token, {
   maxAge: 15*24*60*60*1000,
   httpOnly: true,
   sameSite: "None",
   secure: true,
 });
}


export default genrateToken