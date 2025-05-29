import mongoose from 'mongoose'

const MessageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  user: {
  name:{
    type: String,
  },
  avatar:{
    type: String,
  },
  },
  channelId: {
    type: String,
    default: null
  },
  guildId: {
    type: String,
    default: null 
  },
  isEdited: {
    type: Boolean,
    default: false
  },
  attachments: {
    type: [String], 
    default: []
  },
  embeds: {
    type: [mongoose.Schema.Types.Mixed],
    default: []
  },
  reactions: {
    type: [{
      emoji: String,
      count: { type: Number, default: 1 },
      users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
    }],
    default: []
  }
}, {
  timestamps: true 
});


const Messages = mongoose.model("Messages", MessageSchema)


export default Messages