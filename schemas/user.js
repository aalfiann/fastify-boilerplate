'use strict'

const register = {
  body: {
    type: 'object',
    properties: {
      username: { type: 'string', minLength: 3, maxLength: 20 },
      password: { type: 'string', minLength: 6, maxLength: 20 },
      email: { type: 'string', minLength: 7 }
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

const checkUsername = {
  params: {
    type: 'object',
    properties: {
      username: { type: 'string', minLength: 3, maxLength: 20 }
    }
  }
}

const checkEmail = {
  params: {
    type: 'object',
    properties: {
      email: { type: 'string', minLength: 7 }
    }
  }
}

const forgotPassword = {
  body: {
    type: 'object',
    properties: {
      email: { type: 'string', minLength: 7 }
    },
    required: ['email']
  }
}

module.exports = {
  register,
  login,
  checkUsername,
  checkEmail,
  forgotPassword
}
