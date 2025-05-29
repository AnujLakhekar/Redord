import mongoose from "mongoose"



async function connect() {
  const conn = await mongoose.connect("mongodb+srv://anujlakhekar13:eFNMPTWJxvoyZ5LO@cluster0.r5d5csz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
  
  console.log("connected");
  
}

export default connect