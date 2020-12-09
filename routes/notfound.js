'use strict'

const config = require('../config')
const helper = require('../lib/helper')
const handler = require('../lib/handler')
const pjson = require('../package.json')

async function handlerNotFound (server, options) {
  server.setNotFoundHandler(async function (request, reply) {
    if (request.raw.url.indexOf('/api/') !== -1) {
      handler.notFound(reply, 'Route ' + request.method + ':' + request.url + ' not found!')
    } else {
      const html = await server.view('404', {
        baseUrl: config.baseUrl,
        baseAssetsUrl: config.baseAssetsUrl,
        year: helper.copyrightYear(config.startYearCopyright),
        siteName: config.siteName,
        authorName: config.authorName,
        authorEmail: config.authorEmail,
        authorWebsite: config.authorWebsite,
        tracker: config.tracker,
        version: pjson.version
      })
      handler.html(reply, html)
    }
    await reply
  })
}

module.exports = handlerNotFound
