'use strict'

const config = require('../config')
const moment = require('moment')
const helper = require('../lib/helper')
const pjson = require('../package.json')
const mongooseHandler = require('../lib/mongoose_handler')
const ForgotPassword = require('../models/forgot_password')

async function pageRoute (server, options) {
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
  server.get('/', { onRequest: server.useHtmlCache }, async (request, reply) => {
    // Shallow Clone
    const newTemplateData = { ...templateData }
    newTemplateData.siteTitle = config.siteTitle
    const html = await server.view('index', newTemplateData)
    await reply.html(html)
  })

  server.get('/blank', { onRequest: server.useHtmlCache }, async (request, reply) => {
    const html = await server.view('blank', templateData)
    await reply.html(html)
  })

  server.get('/contact', { onRequest: server.useHtmlCache }, async (request, reply) => {
    const newTemplateData = { ...templateData }
    newTemplateData.useMailer = config.useMailer
    newTemplateData.captcha = config.recaptchaSiteKey
    newTemplateData.hideBadge = config.hideRecaptchaBadge

    const html = await server.view('contact', newTemplateData)
    await reply.html(html)
  })

  server.get('/register', { onRequest: server.useHtmlCache }, async (request, reply) => {
    const html = await server.view('register', templateData)
    await reply.html(html)
  })

  server.get('/login', { onRequest: server.useHtmlCache }, async (request, reply) => {
    const html = await server.view('login', templateData)
    await reply.html(html)
  })

  server.get('/forgot-password', { onRequest: server.useHtmlCache }, async (request, reply) => {
    const html = await server.view('forgot-password', templateData)
    await reply.html(html)
  })

  server.get('/reset-password/:id', { onRequest: server.useHtmlCache }, async (request, reply) => {
    const payload = { ...templateData }
    payload.reset_pass_id = request.params.id

    // Check expired request reset password
    try {
      await mongooseHandler.connect()
    } catch (err) {
      payload.valid = false
      payload.message = err.message
    }

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

    const html = await server.view('reset-password', payload)
    await reply.html(html)
  })

  server.get('/user/:username', { onRequest: server.useHtmlCache }, async (request, reply) => {
    const payload = { ...templateData }
    payload.username = request.params.username

    const html = await server.view('view-profile', payload)
    await reply.html(html)
  })
}

module.exports = pageRoute
