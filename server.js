'use strict'

require('make-promises-safe')
const { readFileSync } = require('fs')
const path = require('path')
const config = require('./config.js')
const cluster = require('cluster')
const numCPUs = require('os').cpus().length
const nodeMailer = require('fastify-nodemailer')
const htmlMinifier = require('html-minifier-terser')
const moment = require('moment')
const helper = require('./lib/helper')
const md5 = require('md5')
const jwt = require('fastify-jwt')
const server = require('fastify')({
  logger: config.logger,
  maxParamLength: config.maxParamLength
})

const App = async () => {
  // Html Cache
  server.decorate('useHtmlCache', async function (request, reply) {
    function injectResponseHeader (etag) {
      return {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=' + 86400,
        Expires: moment().add(86400, 'seconds').utc().format('ddd, DD MMM YYYY HH:mm:ss') + ' GMT',
        Pragma: 'public',
        Etag: etag
      }
    }
    // Template Engine View doesn't have browser cache, so we must inject it manually each routes.
    if (config.isProduction) {
      const etag = '"' + md5(request.url + helper.autoEtag(config.autoEtagAfterHour)) + '"'
      if (request.headers['if-none-match'] === etag) {
        return reply.code(304).send('')
      }
      reply.headers(injectResponseHeader(etag))
    }
  })

  // Routes
  server.decorate('dataRoutes', [])
  server.addHook('onRoute', (routeOptions) => {
    server.dataRoutes.push({
      method: routeOptions.method,
      schema: routeOptions.schema,
      url: routeOptions.url,
      path: routeOptions.path,
      routePath: routeOptions.routePath,
      bodyLimit: routeOptions.bodyLimit,
      logLevel: routeOptions.logLevel,
      logSerializers: routeOptions.logSerializers,
      prefix: routeOptions.prefix
    })
  })

  // Register routes without authentication at here
  server.register(require('./routes/api.js'))
  server.register(require('./routes/db.js'))
  server.register(require('./routes/page.js'))
  server.register(require('./routes/user.js'))

  // Plugins

  // Auth
  server.register(require('fastify-auth'))
  server.decorate('verifyToken', async function (request, reply) {
    if (!request.headers['x-token']) {
      return reply.code(400).send({
        message: 'Missing token header',
        error: 'Bad Request',
        statusCode: 400
      })
    }
    return new Promise(function (resolve, reject) {
      server.jwt.verify(request.headers['x-token'], function (err, decoded) {
        if (err) { return reject(err) };
        resolve(decoded)
      })
    }).catch(function (error) {
      request.log.error(error)
      return reply.code(400).send({
        message: 'Token not valid',
        error: error.message,
        statusCode: 400
      })
    })
  })

  // Register routes with authentication at here
  server.register(require('./routes/auth.js'))

  // JWT
  server.register(jwt, {
    secret: {
      private: readFileSync(`${path.join(__dirname)}/private.key`, 'utf8'),
      public: readFileSync(`${path.join(__dirname)}/public.key`, 'utf8')
    },
    sign: {
      algorithm: config.jwtAlgorithm,
      expiresIn: config.jwtExpiresIn
    }
  })

  // Cors
  server.register(require('fastify-cors'), {
    origin: '*',
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
    allowedHeaders: 'Content-Type, Authorization, X-Requested-With, Etag, X-Token'
  })

  // Template Engine
  server.register(require('point-of-view'), {
    engine: {
      eta: require('eta')
    },
    root: path.join(__dirname, 'views', config.templateDir),
    viewExt: 'html',
    options: {
      production: config.isProduction,
      useHtmlMinifier: htmlMinifier,
      htmlMinifierOptions: (config.useHTMLMinifier ? config.minifierOptions : {})
    }
  })

  // Set everything inside public directory is static file
  server.register(require('fastify-static'), {
    root: path.join(__dirname, 'public'),
    prefix: '/',
    maxAge: (config.maxAgeStaticCache * 1000),
    immutable: true,
    decorateReply: false
  })

  // Set maxage cache longer for all files inside assets directory
  server.register(require('fastify-static'), {
    root: path.join(__dirname, 'public', 'assets'),
    prefix: '/assets/',
    maxAge: (config.maxAgeAssetsCache * 1000),
    immutable: true,
    decorateReply: false
  })

  // Mailer
  server.register(nodeMailer, config.nodeMailerTransport)

  // Custom Not Found Handler
  server.register(require('./routes/notfound.js'))

  // Custom Error Handler
  server.setErrorHandler(async function (error, request, reply) {
    server.log.error(error)
    if (error.validation) {
      return await reply.status(422).send(new Error(error.message))
    }
    return await reply.code(500).send({
      message: 'Whoops, Something went wrong!',
      error: error.message,
      statusCode: 500
    })
  })

  const start = async () => {
    try {
      await server.listen(config.port)
    } catch (err) {
      server.log.error(err)
      process.exit(1)
    }
  }
  start()
}

if (config.useWorker) {
  if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`)
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork()
    }
    cluster.on('exit', worker => {
      console.log(`Worker ${worker.process.pid} died`)
    })
  } else {
    App()
  }
} else {
  App()
}
