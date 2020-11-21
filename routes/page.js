'use strict'

const config = require('../config.js')
const moment = require('moment')
const helper = require('../lib/helper.js')
const pjson = require('../package.json')
const mongooseHandler = require('../lib/mongoose_handler')
const ForgotPassword = require('../models/forgot_password')

async function pageRoute (server, options) {
  /**
   * Template Engine doesn't have html cache so we need to inject it manually via onRequest hooks.
   * This server.useHtmlCache will work if you set isProduction to true only.
   */
  server.get('/', { onRequest: server.useHtmlCache }, async (request, reply) => {
    const html = await server.view('index', {
      baseUrl: config.baseUrl,
      baseAssetsUrl: config.baseAssetsUrl,
      year: helper.copyrightYear(config.startYearCopyright),
      siteName: config.siteName,
      siteTitle: config.siteTitle,
      siteDescription: config.siteDescription,
      authorName: config.authorName,
      authorEmail: config.authorEmail,
      authorWebsite: config.authorWebsite,
      webmaster: config.webmaster,
      tracker: config.tracker,
      version: pjson.version
    })
    await reply.code(200).header('Content-Type', 'text/html; charset=utf-8').send(html)
  })

  server.get('/blank', { onRequest: server.useHtmlCache }, async (request, reply) => {
    const html = await server.view('blank', {
      baseUrl: config.baseUrl,
      baseAssetsUrl: config.baseAssetsUrl,
      year: helper.copyrightYear(config.startYearCopyright),
      siteName: config.siteName,
      siteTitle: config.siteTitle,
      siteDescription: config.siteDescription,
      authorName: config.authorName,
      authorEmail: config.authorEmail,
      authorWebsite: config.authorWebsite,
      webmaster: config.webmaster,
      tracker: config.tracker,
      version: pjson.version
    })
    await reply.code(200).header('Content-Type', 'text/html; charset=utf-8').send(html)
  })

  server.get('/register', { onRequest: server.useHtmlCache }, async (request, reply) => {
    const html = await server.view('register', {
      baseUrl: config.baseUrl,
      baseAssetsUrl: config.baseAssetsUrl,
      year: helper.copyrightYear(config.startYearCopyright),
      siteName: config.siteName,
      siteTitle: config.siteTitle,
      siteDescription: config.siteDescription,
      authorName: config.authorName,
      authorEmail: config.authorEmail,
      authorWebsite: config.authorWebsite,
      webmaster: config.webmaster,
      tracker: config.tracker,
      version: pjson.version
    })
    await reply.code(200).header('Content-Type', 'text/html; charset=utf-8').send(html)
  })

  server.get('/login', { onRequest: server.useHtmlCache }, async (request, reply) => {
    const html = await server.view('login', {
      baseUrl: config.baseUrl,
      baseAssetsUrl: config.baseAssetsUrl,
      year: helper.copyrightYear(config.startYearCopyright),
      siteName: config.siteName,
      siteTitle: config.siteTitle,
      siteDescription: config.siteDescription,
      authorName: config.authorName,
      authorEmail: config.authorEmail,
      authorWebsite: config.authorWebsite,
      webmaster: config.webmaster,
      tracker: config.tracker,
      version: pjson.version
    })
    await reply.code(200).header('Content-Type', 'text/html; charset=utf-8').send(html)
  })

  server.get('/forgot-password', { onRequest: server.useHtmlCache }, async (request, reply) => {
    const html = await server.view('forgot-password', {
      baseUrl: config.baseUrl,
      baseAssetsUrl: config.baseAssetsUrl,
      year: helper.copyrightYear(config.startYearCopyright),
      siteName: config.siteName,
      siteTitle: config.siteTitle,
      siteDescription: config.siteDescription,
      authorName: config.authorName,
      authorEmail: config.authorEmail,
      authorWebsite: config.authorWebsite,
      webmaster: config.webmaster,
      tracker: config.tracker,
      version: pjson.version
    })
    await reply.code(200).header('Content-Type', 'text/html; charset=utf-8').send(html)
  })

  server.get('/reset-password/:id', { onRequest: server.useHtmlCache }, async (request, reply) => {
    const payload = {
      baseUrl: config.baseUrl,
      baseAssetsUrl: config.baseAssetsUrl,
      year: helper.copyrightYear(config.startYearCopyright),
      siteName: config.siteName,
      siteTitle: config.siteTitle,
      siteDescription: config.siteDescription,
      authorName: config.authorName,
      authorEmail: config.authorEmail,
      authorWebsite: config.authorWebsite,
      webmaster: config.webmaster,
      tracker: config.tracker,
      version: pjson.version
    }

    // Check expired request reset password
    const conn = await mongooseHandler.connect().catch(err => {
      payload.valid = false
      payload.message = err.message
    })

    if (conn) {
      if (!payload.valid) {
        const result = await ForgotPassword.find({
          $and: [
            { id: request.params.id },
            { expired_at: { $gte: moment().format('x') } },
            { status: false }
          ]
        }).catch(err => {
          payload.valid = false
          payload.message = err.message
        })

        if (result.length > 0) {
          payload.valid = true
          payload.message = ''
        } else {
          payload.valid = false
          payload.message = 'Link to Reset Password already expired.'
        }
      }
    }

    const html = await server.view('reset-password', payload)
    await reply.code(200).header('Content-Type', 'text/html; charset=utf-8').send(html)
  })
}

module.exports = pageRoute
