'use strict'

const config = {
  // CORE
  port: process.env.PORT || 3000, // Port Server (default is 3000)
  logger: true, // Server Log (default is true)
  useWorker: false, // Use CPU as worker. Please don't use this if you're at shared hosting. (default is false)
  maxParamLength: 100, // Maximum url parameter query length (default is 100 characters)
  jwtAlgorithm: 'RS256',
  jwtExpiresIn: '1h',
  mongoDBConn: {
    user: '',
    pass: '',
    host: 'localhost',
    port: 27017,
    database: 'fastify_boilerplate'
  },
  mongoDBOptions: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  },
  mongoDBBackup: {
    removeOldBackup: true,
    keepLastDaysBackup: 2,
    autoBackupPath: './backup/'
  },
  mongoCache: {
    engine: 'memory', // You are able to set engine for redis, file or memory. (default is memory)
    redisConn: '' // If engine is redis then you have to set this redis connection string. Ex: redis://localhost:6379
  },

  // =========================================

  // APP CACHE
  // configuration ttl cache is here (in second)
  // zero means manual release cache (no auto release)
  appCache: {
    menu: 0,
    my_profile: 3600, // cache will auto release in 1 hour.
    public_profile: 3600
  },

  // =========================================

  // WEBSITE
  // This is the base url, used for template engine
  // Change with your domain without trailing slash.
  // Example : https://imgproxify.com
  baseUrl: 'http://localhost:3000',
  baseAssetsUrl: 'http://localhost:3000',
  siteName: 'Fastify Boilerplate',
  siteTitle: 'Fastify Boilerplate with JWT, Mongoose and Bulma',
  siteDescription: 'Fastify Boilerplate with JWT, Mongoose and Bulma.',
  authorName: 'M ABD AZIZ ALFIAN',
  authorWebsite: 'https://aalfiann.github.io',
  authorEmail: 'aalfiann@gmail.com',
  startYearCopyright: 2020,
  webmaster: { // Just leave blank if you don't want to use this
    google: '', // Get the verification id at >> https://www.google.com/webmasters
    bing: '', // Get the verification id at >> https://www.bing.com/toolbox/webmaster
    yandex: '' // Get the verification id at >> https://webmaster.yandex.com
  },
  tracker: {
    googleAnalyticsID: '' // Get GA tracker id at >> https://analytics.google.com
  },

  // Mailer
  // useMailer will affect on contact form page
  useMailer: true,
  // All mails will send to this email address
  // Note:
  // - This email address should be different with email address for transport
  // - You are able to use any email service like gmail, yahoo, etc for your inbox.
  recipientEmailAddress: 'your_inbox_mail@gmail.com',
  // nodeMailerTransport config.
  // For more detail configuration, please see >> https://nodemailer.com
  // Using smtp gmail will be need oauth2, it's hard to config, so I do recommend to setup no_reply email from your cpanel.
  nodeMailerTransport: {
    pool: true,
    host: 'smtp.yourdomain.com',
    port: 465,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
      user: 'your_noreply_mail@yourdomain.com',
      pass: 'xxxxxxx'
    }
  },

  // Template Engine Configuration
  // Set directory of your template
  templateDir: 'default',
  // When you set isProduction to true, then template engine will heavily cache the response.
  // Mode production speed is much faster but you need to restart the app if you have modified the template. (default is false)
  isProduction: false,
  // When you set to true, html page source will be minified.
  // Note:
  // - Javascript inline in html will not be minified.
  // - Not all shared hosting will work.
  useHTMLMinifier: false,
  // Options for html minifier (this will work if you set useHTMLMinifier to true)
  // For more detail, see https://github.com/terser/html-minifier-terser#options-quick-reference
  minifierOptions: {
    removeComments: true,
    removeCommentsFromCDATA: true,
    collapseWhitespace: true,
    collapseBooleanAttributes: true,
    removeAttributeQuotes: true,
    removeEmptyAttributes: true,
    minifyJS: true,
    minifyCSS: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    removeOptionalTags: true,
    removeRedundantAttributes: true
  },
  // this autoEtag will work if isProduction set to true.
  autoEtagAfterHour: 12, // This will generate etag for every 12hours in a day. (max 24)

  // Static Cache
  maxAgeStaticCache: (3600 * 24), // cache for regular static pages (default is 1 day in seconds)
  maxAgeAssetsCache: (3600 * 24 * 30), // cache for assets ( default is 30 days in seconds)

  // Anti Spam Google reCaptcha v3
  // Register at here >> https://www.google.com/recaptcha
  // Just leave this blank if you don't want to use Google reCaptcha v3
  recaptchaSiteKey: '',
  recaptchaSecretKey: '',
  hideRecaptchaBadge: true
}

module.exports = config
