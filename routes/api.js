'use strict'

const handler = require('../lib/handler')

async function apiRoute (server, options) {
  server.get('/api/routes', { onRequest: server.useHtmlCache }, async (request, reply) => {
    await handler.success(reply, 'Get data routes success', { data: server.dataRoutes })
  })
}

module.exports = apiRoute
