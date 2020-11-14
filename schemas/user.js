'use strict'

const register = {
  body: {
    type: 'object',
    properties: {
      username: { type: 'string' },
      password: { type: 'string' },
      email: { type: 'string' }
    },
    required: ['username', 'password', 'email']
  }
}

const login = {
  body: {
    type: 'object',
    properties: {
      username: { type: 'string' },
      password: { type: 'string' }
    },
    required: ['username', 'password']
  }
}

module.exports = {
  register,
  login
}
