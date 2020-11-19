'use strict'

const schema = require('../schemas/auth')

async function authRoute (server, options) {
  server.post('/api/auth/verify', {
    schema: {
      headers: schema.auth
    },
    preHandler: server.auth([
      server.verifyToken
    ])
  }, async (request, reply) => {
    await reply.code(200).send({
      message: 'Verify authentication success!',
      statusCode: 200,
      jwt: server.jwt.verify(request.headers['x-token'])
    })
  })
}

module.exports = authRoute
