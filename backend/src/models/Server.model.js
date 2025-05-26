import mongoose from 'mongoose'
const ServerSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DiscordUser',
    required: true
  },
  icon: {
    type: String,
    default: null
  },
  region: {
    type: String,
    default: 'us-central'
  },
  roles: [{
    name: String,
    permissions: [String],
    color: String,
    isDefault: { type: Boolean, default: false }
  }],
  channels: [{
    name: String,
    type: {
      type: String,
      enum: ['text', 'voice', 'category'],
      default: 'text'
    },
    channelId: String
  }],
  settings: {
    prefix: {
      type: String,
      default: '!'
    },
    welcomeMessage: {
      type: String,
      default: null
    },
    language: {
      type: String,
      default: 'en'
    },
    nsfwFilter: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true
});

const Servers = mongoose.model("Servers", ServerSchema)


export default Servers