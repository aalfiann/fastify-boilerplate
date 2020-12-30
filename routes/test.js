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

  server.post('/api/test/cache', async (request, reply) => {
    try {
      await mongooseHandler.connect()
    } catch (err) {
      return reply.error(err.message)
    }
    const User = require('../models/user')
    const total = await User.countDocuments().cache(120)
    await reply.success('Test Cache', { total_user: total })
  })
}

module.exports = testRoute
