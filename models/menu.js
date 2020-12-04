'use strict'

const mongooseHandler = require('../lib/mongoose_handler.js')
const menuSchema = {
  id: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  url: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    trim: true
  },
  scope: {
    type: String,
    required: true,
    trim: true
  },
  position: { type: Number, required: true },
  icon: { type: String },
  child: { type: Array },
  status: { type: Boolean },
  created_at: { type: Number },
  updated_at: { type: Number }
}

module.exports = mongooseHandler.setModel('Menu', menuSchema)
