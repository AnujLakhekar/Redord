import mongoose from 'mongoose'

const DiscordUserSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: false,
    default: ""
  },
  email: {
    type: String,
    required: true
  },
  discriminator: {
    type: String,
    default: ""
  },
  avatar: {
    type: String,
    default: null
  },
  isBot: {
    type: Boolean,
    default: false
  },
  chats: [
    {
    from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
    },
    to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
    },
    content: [{
    text: {
    type: String,
    default: null
    },
    img: {
    type: String,
    default: null
    },
    }]
    },
    ],
  joinedAt: {
    type: Date,
    default: Date.now
  },
  roles: {
    type: [String],
    default: []
  },
  settings: {
    prefix: {
      type: String,
      default: "!"
    },
    language: {
      type: String,
      default: "en"
    }
  }
}, {
  timestamps: true 
});


const User = mongoose.model('users', DiscordUserSchema);

export default User;
