'use strict'

const mongooseHandler = require('../lib/mongoose_handler.js')
const userSchema = {
  id: {
    type: String,
    required: [true, 'id is required'],
    trim: true,
    unique: true
  },
  username: {
    type: String,
    required: [true, 'username is required'],
    trim: true,
    unique: true
  },
  email: {
    type: String,
    required: [true, 'email is required'],
    trim: true,
    unique: true
  },
  role: {
    type: String,
    required: [true, 'role is required']
  },
  name: { type: String },
  hash: { type: String },
  created_at: { type: Number },
  updated_at: { type: Number }
}

module.exports = mongooseHandler.setModel('User', userSchema)
