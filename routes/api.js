'use strict'

async function apiRoute (server, options) {
  server.get('/api/routes', { onRequest: server.useHtmlCache }, async (request, reply) => {
    reply.success('Get data routes success', { data: server.dataRoutes })
  })
}

module.exports = apiRoute
