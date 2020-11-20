'use strict'

const { v4: uuidv4 } = require('uuid')
const moment = require('moment')
const helper = require('../lib/password')
const mongooseHandler = require('../lib/mongoose_handler.js')
const User = require('../models/user')
const ForgotPassword = require('../models/forgot_password')
const password = require('../lib/password')
const schema = require('../schemas/user')
const obase64 = require('../lib/obase64')
const config = require('../config')

async function userRoute (server, options) {
  server.post('/api/user/register', { schema: schema.register }, async (request, reply) => {
    const user = {
      id: uuidv4(),
      username: request.body.username,
      name: request.body.name,
      email: request.body.email,
      hash: await helper.generate(request.body.password),
      created_at: moment().format('x')
    }

    await mongooseHandler.connect().catch(err => {
      return reply.code(500).send({
        message: err.message,
        statusCode: 500
      })
    })

    const result = await User.estimatedDocumentCount().catch(err => {
      return reply.code(400).send(mongooseHandler.errorBuilder(err))
    })

    if (result === 0) {
      user.role = 'admin'
    } else {
      user.role = 'member'
    }

    User(user).save().then(done => {
      reply.code(200).send({
        message: 'Register new user success!',
        statusCode: 200
      })
    }).catch(err => {
      reply.code(400).send(mongooseHandler.errorBuilder(err))
    })
    await reply
  })

  server.post('/api/user/login', { schema: schema.login }, async (request, reply) => {
    let token = ''

    await mongooseHandler.connect().catch(err => {
      return reply.code(500).send({
        message: err.message,
        statusCode: 500
      })
    })

    const result = await User.find({
      $or: [
        { username: request.body.username },
        { email: request.body.username }
      ]
    }).catch(err => {
      return reply.code(400).send(mongooseHandler.errorBuilder(err))
    })

    if (result.length > 0) {
      token = server.jwt.sign({
        uid: result[0].id,
        unm: result[0].username,
        name: result[0].name,
        mail: result[0].email,
        role: obase64.encode(result[0].role)
      })

      const pass = await password.compare(request.body.password, result[0].hash).catch(err => {
        return reply.code(500).send({
          message: err.message,
          statusCode: 500
        })
      })

      if (pass) {
        await server.jwt.verify(token, function (err, decoded) {
          if (err) {
            return reply.code(403).send({
              message: err.message,
              statusCode: 400,
              success: pass
            })
          };
          reply.code(200).send({
            message: 'Login user success!',
            statusCode: 200,
            success: pass,
            token: token,
            expire: decoded.exp
          })
        })
      } else {
        return reply.code(403).send({
          message: 'Wrong username or password!',
          statusCode: 403,
          success: false
        })
      }
    } else {
      reply.code(403).send({
        message: 'Wrong username or password!',
        statusCode: 403,
        success: false
      })
    }
    await reply
  })

  server.get('/api/user/check-username/:username', { schema: schema.checkUsername }, async (request, reply) => {
    await mongooseHandler.connect().catch(err => {
      return reply.code(500).send({
        message: err.message,
        statusCode: 500
      })
    })

    const result = await User.find({ username: request.params.username }).catch(err => {
      return reply.code(400).send(mongooseHandler.errorBuilder(err))
    })

    reply.code(200).send({
      message: (result.length > 0) ? 'Username is not available!' : 'Username is OK!',
      statusCode: 200,
      data: {
        total: result.length
      }
    })
    await reply
  })

  server.get('/api/user/check-email/:email', { schema: schema.checkEmail }, async (request, reply) => {
    await mongooseHandler.connect().catch(err => {
      return reply.code(500).send({
        message: err.message,
        statusCode: 500
      })
    })

    const result = await User.find({ email: request.params.email }).catch(err => {
      return reply.code(400).send(mongooseHandler.errorBuilder(err))
    })

    reply.code(200).send({
      message: (result.length > 0) ? 'Email address is not available!' : 'Email address is OK!',
      statusCode: 200,
      data: {
        total: result.length
      }
    })
    await reply
  })

  server.post('/api/user/generate-reset-password', { schema: schema.forgotPassword }, async (request, reply) => {
    const forgotpass = {
      id: uuidv4(),
      status: false,
      created_at: moment().format('x'),
      expired_at: moment().add((60 * 60 * 24 * 3), 'seconds').format('x') // expired in 3days
    }

    await mongooseHandler.connect().catch(err => {
      return reply.code(500).send({
        message: err.message,
        statusCode: 500
      })
    })

    const result = await User.find({ email: request.body.email }).catch(err => {
      return reply.code(400).send(mongooseHandler.errorBuilder(err))
    })

    if (result.length > 0) {
      forgotpass.user_id = result[0].id
      const done = await ForgotPassword(forgotpass).save().catch(err => {
        return reply.code(400).send(mongooseHandler.errorBuilder(err))
      })

      if (done) {
        const htmlEmail = await server.view('email-reset', {
          mail_subject: 'Link Reset Password at ' + config.siteName,
          mail_reset_link: config.baseUrl + '/reset-password/' + done.id,
          mail_sitename: config.siteName,
          mail_baseurl: config.baseUrl,
          mail_img_logo: ''
        })

        await server.nodemailer.sendMail({
          from: '"' + config.siteName + '" <' + config.nodeMailerTransport.auth.user + '>',
          to: result[0].email,
          subject: 'Link Reset Password at ' + config.siteName,
          html: htmlEmail
        }, (err, info) => {
          if (err) {
            return reply.code(400).send({
              message: 'Send Message Failed!',
              error: err,
              statusCode: 400
            })
          }
          reply.code(200).send({
            statusCode: 200,
            message: 'Reset password link has already sent to your email.'
          })
        })
      }
    } else {
      return reply.code(200).send({
        statusCode: 200,
        message: 'Email address is not exists.',
        data: {
          total: result.length
        }
      })
    }
    await reply
  })
}

module.exports = userRoute
