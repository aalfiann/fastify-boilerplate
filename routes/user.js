'use strict'

const { v4: uuidv4 } = require('uuid')
const moment = require('moment')
const helper = require('../lib/password')
const handler = require('../lib/handler')
const mongooseHandler = require('../lib/mongoose_handler')
const User = require('../models/user')
const ForgotPassword = require('../models/forgot_password')
const password = require('../lib/password')
const schema = require('../schemas/user')
const authSchema = require('../schemas/auth')
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
      return handler.error(reply, err.message)
    })

    const result = await User.estimatedDocumentCount().catch(err => {
      return handler.mongooseError(reply, mongooseHandler.errorBuilder(err))
    })

    if (result === 0) {
      user.role = 'admin'
    } else {
      user.role = 'member'
    }

    User(user).save().then(done => {
      handler.success(reply, 'Register new user success!')
    }).catch(err => {
      handler.mongooseError(reply, mongooseHandler.errorBuilder(err))
    })
    await reply
  })

  server.post('/api/user/login', { schema: schema.login }, async (request, reply) => {
    let token = ''

    await mongooseHandler.connect().catch(err => {
      return handler.error(reply, err.message)
    })

    const result = await User.find({
      $or: [
        { username: request.body.username },
        { email: request.body.username }
      ]
    }).catch(err => {
      return handler.mongooseError(reply, mongooseHandler.errorBuilder(err))
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
        return handler.error(reply, err.message)
      })

      if (pass) {
        await server.jwt.verify(token, function (err, decoded) {
          if (err) {
            return handler.badRequest(reply, err.message, { success: pass })
          };
          handler.success(reply, 'Login user success!', { success: pass, token: token, expire: decoded.exp })
        })
      } else {
        return handler.forbidden(reply, 'Wrong username or password!', { success: false })
      }
    } else {
      handler.forbidden(reply, 'Wrong username or password!', { success: false })
    }
    await reply
  })

  server.get('/api/user/check-username/:username', { schema: schema.checkUsername }, async (request, reply) => {
    await mongooseHandler.connect().catch(err => {
      return handler.error(reply, err.message)
    })

    const result = await User.find({ username: request.params.username }).catch(err => {
      return handler.mongooseError(reply, mongooseHandler.errorBuilder(err))
    })

    handler.success(reply, (result.length > 0) ? 'Username is not available!' : 'Username is OK!', {
      data: {
        total: result.length
      }
    })
    await reply
  })

  server.get('/api/user/check-email/:email', { schema: schema.checkEmail }, async (request, reply) => {
    await mongooseHandler.connect().catch(err => {
      return handler.error(reply, err.message)
    })

    const result = await User.find({ email: request.params.email }).catch(err => {
      return handler.mongooseError(reply, mongooseHandler.errorBuilder(err))
    })

    handler.success(reply, (result.length > 0) ? 'Email address is not available!' : 'Email address is OK!', {
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
      return handler.error(reply, err.message)
    })

    const result = await User.find({ email: request.body.email }).catch(err => {
      return handler.mongooseError(reply, mongooseHandler.errorBuilder(err))
    })

    if (result.length > 0) {
      forgotpass.user_id = result[0].id
      const done = await ForgotPassword(forgotpass).save().catch(err => {
        return handler.mongooseError(reply, mongooseHandler.errorBuilder(err))
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
            return handler.badRequest(reply, 'Send Message Failed!', { error: err })
          }
          handler.success(reply, 'Reset password link has already sent to your email.', { success: true })
        })
      }
    } else {
      return handler.success(reply, 'Email address is not exists.', {
        data: {
          total: result.length
        },
        success: false
      })
    }
    await reply
  })

  server.post('/api/user/reset-password', { schema: schema.resetPassword }, async (request, reply) => {
    await mongooseHandler.connect().catch(err => {
      return handler.error(reply, err.message)
    })

    const result = await ForgotPassword.find({
      $and: [
        { id: request.body.id },
        { status: false }
      ]
    }).catch(err => {
      return handler.mongooseError(reply, mongooseHandler.errorBuilder(err))
    })

    if (result.length > 0) {
      // find user and update
      const done = await User.findOneAndUpdate({ id: result[0].user_id }, {
        hash: await helper.generate(request.body.password),
        updated_at: moment().format('x')
      }, { new: true }).catch(err => {
        return handler.mongooseError(reply, mongooseHandler.errorBuilder(err))
      })

      if (done) {
        // reupdate to make expired this request reset password
        const reupdate = await ForgotPassword.findOneAndUpdate({ id: request.body.id }, {
          status: true
        }, { new: true }).catch(err => {
          return handler.mongooseError(reply, mongooseHandler.errorBuilder(err))
        })

        if (reupdate) {
          handler.success(reply, 'Your password has been successfully changed!', { success: true })
        } else {
          handler.success(reply, 'Failed to reset your password! Please contact us, something went wrong and we need more futher information from you.', { success: false })
        }
      } else {
        handler.success(reply, 'Failed to reset your password! Please contact us, something went wrong and we need more futher information from you.', { success: false })
      }
    } else {
      handler.success(reply, 'The request to reset password has been expired!', { success: false })
    }
    await reply
  })

  server.post('/api/user/change-password', {
    schema: {
      headers: authSchema.auth,
      body: schema.changePassword
    },
    preHandler: server.auth([
      server.verifyToken
    ])
  }, async (request, reply) => {
    await mongooseHandler.connect().catch(err => {
      return handler.error(reply, err.message)
    })

    // get hash
    const decoded = server.jwt.decode(request.headers['x-token'])
    const found = await User.find({
      id: decoded.uid
    }).catch(err => {
      return handler.mongooseError(mongooseHandler.errorBuilder(err))
    })

    if (found) {
      // compare password
      const pass = await password.compare(request.body.oldpassword, found[0].hash).catch(err => {
        return handler.error(reply, err.message)
      })

      if (pass) {
        // update password
        const updated = await User.findOneAndUpdate({
          id: decoded.uid
        }, {
          hash: await password.generate(request.body.newpassword)
        }, { new: true }).catch(err => {
          return handler.mongooseError(mongooseHandler.errorBuilder(err))
        })
        if (updated) {
          handler.success(reply, 'Your password successfully changed!', { success: true })
        } else {
          handler.success(reply, 'Failed to change your password!', { success: false })
        }
      } else {
        handler.success(reply, 'Your old password is wrong!', { success: false })
      }
    } else {
      handler.forbidden(reply, 'Invalid token!', { success: false })
    }

    // reply.code(200).send(decoded)
    // await server.jwt.verify(request.headers['x-token'], function (err, decoded) {
    //   if (err) return console.log(err)
    //   reply.code(200).send(decoded)
    // })

    // const found = await User.find({ username: request.body.username }).catch(err => {
    //   return reply.code(400).send(mongooseHandler.errorBuilder(err))
    // })

    // if (found) {
    //   // reupdate to make expired this request reset password
    //   const reupdate = await ForgotPassword.findOneAndUpdate({ id: request.body.id }, {
    //     status: true
    //   }, { new: true }).catch(err => {
    //     return reply.code(400).send(mongooseHandler.errorBuilder(err))
    //   })

    //   if (reupdate) {
    //     reply.code(200).send({
    //       message: 'Your password has been succeessfully changed!',
    //       statusCode: 200,
    //       success: true
    //     })
    //   } else {
    //     reply.code(200).send({
    //       message: 'Failed to reset your password! Please contact us, something went wrong and we need more futher information from you.',
    //       statusCode: 200,
    //       success: false
    //     })
    //   }
    // } else {
    //   reply.code(200).send({
    //     message: 'Failed to reset your password! Please contact us, something went wrong and we need more futher information from you.',
    //     statusCode: 200,
    //     success: false
    //   })
    // }
    await reply
  })
}

module.exports = userRoute
