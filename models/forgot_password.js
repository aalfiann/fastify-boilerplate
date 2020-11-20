'use strict'

const mongooseHandler = require('../lib/mongoose_handler.js')
const forgotPasswordSchema = {
  id: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  user_id: {
    type: String,
    required: true,
    trim: true
  },
  status: { type: Boolean },
  created_at: {
    type: Number,
    required: true
  },
  updated_at: { type: Number },
  expired_at: {
    type: Number,
    required: true
  }
}

module.exports = mongooseHandler.setModel('ForgotPassword', forgotPasswordSchema)
