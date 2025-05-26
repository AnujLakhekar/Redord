import mongoose from "mongoose"



async function connect() {
  const conn = await mongoose.connect(process.env.MONGO_CLIENT_URL);
  
  console.log("connected");
  
}

export default connect