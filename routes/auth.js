'use strict'

const schema = require('../schemas/auth')
const handler = require('../lib/handler')

async function authRoute (server, options) {
  server.post('/api/auth/verify', {
    schema: {
      headers: schema.auth
    },
    preHandler: server.auth([
      server.verifyToken
    ])
  }, async (request, reply) => {
    await handler.success(reply, 'Verify authentication success!', {
      jwt: server.jwt.verify(request.headers['x-token'])
    })
  })
}

module.exports = authRoute
