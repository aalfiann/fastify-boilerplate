'use strict'

const mongooseHandler = require('../lib/mongoose_handler')

async function testRoute (server, options) {
  server.post('/api/test/connection-database', async (request, reply) => {
    const connect = await mongooseHandler.connect().catch(err => {
      return reply.error(err.message)
    })
    if (connect) {
      reply.success('Database connected!')
    }
    await reply
  })
}

module.exports = testRoute
