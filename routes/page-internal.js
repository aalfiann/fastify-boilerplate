'use strict'

const config = require('../config')
const helper = require('../lib/helper')
const handler = require('../lib/handler')
const pjson = require('../package.json')

async function pageInternalRoute (server, options) {
  /**
   * Default variable for template engine
   */
  const templateData = {
    baseUrl: config.baseUrl,
    baseAssetsUrl: config.baseAssetsUrl,
    year: helper.copyrightYear(config.startYearCopyright),
    siteName: config.siteName,
    siteDescription: config.siteDescription,
    authorName: config.authorName,
    authorEmail: config.authorEmail,
    authorWebsite: config.authorWebsite,
    webmaster: config.webmaster,
    tracker: config.tracker,
    version: pjson.version
  }

  /**
   * Template Engine doesn't have html cache so we need to inject it manually via onRequest hooks.
   * This server.useHtmlCache will work if you set isProduction to true only.
   */
  server.get('/dashboard-admin', { onRequest: server.useHtmlCache }, async (request, reply) => {
    // Shallow Clone
    const newTemplateData = { ...templateData }
    newTemplateData.siteTitle = config.siteTitle
    const html = await server.view('dashboard-admin', newTemplateData)
    await handler.html(reply, html)
  })

  server.get('/dashboard', { onRequest: server.useHtmlCache }, async (request, reply) => {
    // Shallow Clone
    const newTemplateData = { ...templateData }
    newTemplateData.siteTitle = config.siteTitle
    const html = await server.view('dashboard', newTemplateData)
    await handler.html(reply, html)
  })

  server.get('/setting/menu', { onRequest: server.useHtmlCache }, async (request, reply) => {
    const html = await server.view('menu', templateData)
    await handler.html(reply, html)
  })

  server.get('/change-password', { onRequest: server.useHtmlCache }, async (request, reply) => {
    const html = await server.view('change-password', templateData)
    await handler.html(reply, html)
  })
}

module.exports = pageInternalRoute
