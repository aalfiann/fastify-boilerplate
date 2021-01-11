'use strict'

const axios = require('axios').default
const config = require('../config.js')
const schema = require('../schemas/verify')

async function verifyRoute (server, options) {
  server.post('/verify/captcha', { schema: schema.recaptcha }, async (request, reply) => {
    if (request.body.token && config.recaptchaSecretKey) {
      axios({
        method: 'post',
        url: 'https://www.google.com/recaptcha/api/siteverify?secret=' + config.recaptchaSecretKey + '&response=' + request.body.token
      })
        .then(function (response) {
          if (response.data.success) {
            reply.code(200).send({
              message: 'Verify Success!',
              statusCode: 200,
              data: response.data
            })
          } else {
            reply.code(400).send({
              message: 'Verify Failed!',
              error: response.data['error-codes'][0],
              statusCode: 400
            })
          }
        })
        .catch(function (error) {
          console.log(error)
          reply.code(400).send({
            message: 'Verify Failed!',
            error: 'Failed to connect with Google Recaptcha.',
            statusCode: 400
          })
        })
    } else {
      reply.code(400).send({
        message: 'Verify Failed!',
        error: 'Recaptcha Token and Secret Key is required!',
        statusCode: 400
      })
    }
    await reply
  })
}

module.exports = verifyRoute
