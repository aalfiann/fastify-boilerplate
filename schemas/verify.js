'use strict'

const recaptcha = {
  body: {
    type: 'object',
    properties: {
      token: { type: 'string' }
    },
    required: ['token']
  }
}

module.exports = {
  recaptcha
}
