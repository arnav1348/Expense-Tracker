// User Schema
const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    username: { 
      type: String, 
      required: true, 
      unique: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true 
    },
    password: { 
      type: String, 
      required: true 
    },
    avatar: { 
      type: String, 
      default: '/default-avatar.png' 
    }
  });
  
  const User = mongoose.model('User', UserSchema);
  module.exports = User;