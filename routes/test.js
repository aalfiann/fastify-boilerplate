'use strict'

const mongooseHandler = require('../lib/mongoose_handler')

async function testRoute (server, options) {
  server.post('/api/test/connection-database', async (request, reply) => {
    try {
      await mongooseHandler.connect()
    } catch (err) {
      return reply.error(err.message)
    }
    await reply.success('Database connected!')
  })
}

module.exports = testRoute
