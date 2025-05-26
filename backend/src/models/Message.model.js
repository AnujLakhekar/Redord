import mongoose from 'mongoose'

const MessageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  channelId: {
    type: String,
    required: true
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
      users: [{ type: Schema.Types.ObjectId, ref: 'User' }]
    }],
    default: []
  }
}, {
  timestamps: true 
});


const Messages = mongoose.model("Messages", MessageSchema)


export default Messages