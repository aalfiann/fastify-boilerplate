/**
 * Fastify Auth Condition Plugin
 */
'use strict'

const fp = require('fastify-plugin')

async function authConditionPlugin (app) {
  app.decorate('verifyToken', async function (request, reply) {
    if (!request.headers['x-token']) {
      return reply.code(400).send({
        message: 'Missing token header',
        error: 'Bad Request',
        statusCode: 400
      })
    }
    return new Promise(function (resolve, reject) {
      app.jwt.verify(request.headers['x-token'], function (err, decoded) {
        if (err) { return reject(err) };
        resolve(decoded)
      })
    }).catch(function (error) {
      request.log.error(error)
      return reply.code(400).send({
        message: 'Token not valid',
        error: error.message,
        statusCode: 400
      })
    })
  })
}

module.exports = fp(authConditionPlugin)
