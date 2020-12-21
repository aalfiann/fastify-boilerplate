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

const getProfile = {
  params: {
    type: 'object',
    properties: {
      username: { type: 'string' }
    }
  }
}

const addUser = {
  type: 'object',
  properties: {
    username: { type: 'string', minLength: 3, maxLength: 20 },
    password: { type: 'string', minLength: 6, maxLength: 20 },
    role: { type: 'string' },
    email: { type: 'string', minLength: 7 }
  },
  required: ['username', 'email', 'password', 'role']
}

const updateUser = {
  type: 'object',
  properties: {
    username: { type: 'string', minLength: 3, maxLength: 20 },
    password: { type: 'string', minLength: 6, maxLength: 20 },
    role: { type: 'string' },
    status: { type: 'boolean' },
    email: { type: 'string', minLength: 7 }
  },
  required: ['username', 'email', 'password', 'role', 'status']
}

const deleteUser = {
  type: 'object',
  properties: {
    username: { type: 'string', minLength: 3, maxLength: 20 }
  },
  required: ['username']
}

const listUser = {
  type: 'object',
  properties: {
    search: { type: 'string' },
    last_created_at: { type: 'integer' },
    limit: { type: 'integer' }
  }
}

module.exports = {
  register,
  login,
  checkUsername,
  checkEmail,
  forgotPassword,
  resetPassword,
  changePassword,
  editProfile,
  getProfile,
  addUser,
  updateUser,
  deleteUser,
  listUser
}
