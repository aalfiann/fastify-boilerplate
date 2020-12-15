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

const resetPassword = {
  body: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      password: { type: 'string', minLength: 6, maxLength: 20 }
    },
    required: ['id', 'password']
  }
}

const changePassword = {
  type: 'object',
  properties: {
    oldpassword: { type: 'string', minLength: 6, maxLength: 20 },
    newpassword: { type: 'string', minLength: 6, maxLength: 20 }
  },
  required: ['oldpassword', 'newpassword']
}

const editProfile = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 3 },
    email: { type: 'string', minLength: 7 },
    address: { type: 'string' },
    bio: { type: 'string' },
    link: { type: 'array' }
  },
  required: ['name', 'email']
}

module.exports = {
  register,
  login,
  checkUsername,
  checkEmail,
  forgotPassword,
  resetPassword,
  changePassword,
  editProfile
}
