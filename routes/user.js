'use strict'

const { v4: uuidv4 } = require('uuid')
const moment = require('moment')
const helper = require('../lib/password')
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
    const timeNow = moment().format('x')
    const user = {
      id: uuidv4(),
      username: request.body.username,
      name: request.body.name,
      email: request.body.email,
      hash: await helper.generate(request.body.password),
      created_at: timeNow,
      updated_at: timeNow
    }

    await mongooseHandler.connect().catch(err => {
      return reply.error(err.message)
    })

    const result = await User.estimatedDocumentCount().catch(err => {
      return reply.mongooseError(mongooseHandler.errorBuilder(err))
    })

    if (result === 0) {
      user.role = 'admin'
    } else {
      user.role = 'member'
    }

    User(user).save().then(done => {
      reply.success('Register new user success!')
    }).catch(err => {
      reply.mongooseError(mongooseHandler.errorBuilder(err))
    })
    await reply
  })

  server.post('/api/user/login', { schema: schema.login }, async (request, reply) => {
    let token = ''

    await mongooseHandler.connect().catch(err => {
      return reply.error(err.message)
    })

    const result = await User.find({
      $or: [
        { username: request.body.username },
        { email: request.body.username }
      ]
    }).catch(err => {
      return reply.mongooseError(mongooseHandler.errorBuilder(err))
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
        return reply.error(err.message)
      })

      if (pass) {
        await server.jwt.verify(token, function (err, decoded) {
          if (err) {
            return reply.badRequest(err.message, { success: pass })
          };
          reply.success('Login user success!', { success: pass, token: token, expire: decoded.exp })
        })
      } else {
        return reply.forbidden('Wrong username or password!', { success: false })
      }
    } else {
      reply.forbidden('Wrong username or password!', { success: false })
    }
    await reply
  })

  server.get('/api/user/check-username/:username', { schema: schema.checkUsername }, async (request, reply) => {
    await mongooseHandler.connect().catch(err => {
      return reply.error(err.message)
    })

    const result = await User.find({ username: request.params.username }).catch(err => {
      return reply.mongooseError(mongooseHandler.errorBuilder(err))
    })

    reply.success((result.length > 0) ? 'Username is not available!' : 'Username is OK!', {
      data: {
        total: result.length
      }
    })
    await reply
  })

  server.get('/api/user/check-email/:email', { schema: schema.checkEmail }, async (request, reply) => {
    await mongooseHandler.connect().catch(err => {
      return reply.error(err.message)
    })

    const result = await User.find({ email: request.params.email }).catch(err => {
      return reply.mongooseError(mongooseHandler.errorBuilder(err))
    })

    reply.success((result.length > 0) ? 'Email address is not available!' : 'Email address is OK!', {
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
      return reply.error(err.message)
    })

    const result = await User.find({ email: request.body.email }).catch(err => {
      return reply.mongooseError(mongooseHandler.errorBuilder(err))
    })

    if (result.length > 0) {
      forgotpass.user_id = result[0].id
      const done = await ForgotPassword(forgotpass).save().catch(err => {
        return reply.mongooseError(mongooseHandler.errorBuilder(err))
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
            return reply.badRequest('Send Message Failed!', { error: err })
          }
          reply.success('Reset password link has already sent to your email.', { success: true })
        })
      }
    } else {
      return reply.success('Email address is not exists.', {
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
      return reply.error(err.message)
    })

    const result = await ForgotPassword.find({
      $and: [
        { id: request.body.id },
        { status: false }
      ]
    }).catch(err => {
      return reply.mongooseError(mongooseHandler.errorBuilder(err))
    })

    if (result.length > 0) {
      // find user and update
      const done = await User.findOneAndUpdate({ id: result[0].user_id }, {
        hash: await helper.generate(request.body.password),
        updated_at: moment().format('x')
      }, { new: true }).catch(err => {
        return reply.mongooseError(mongooseHandler.errorBuilder(err))
      })

      if (done) {
        // reupdate to make expired this request reset password
        const reupdate = await ForgotPassword.findOneAndUpdate({ id: request.body.id }, {
          status: true
        }, { new: true }).catch(err => {
          return reply.mongooseError(mongooseHandler.errorBuilder(err))
        })

        if (reupdate) {
          reply.success('Your password has been successfully changed!', { success: true })
        } else {
          reply.success('Failed to reset your password! Please contact us, something went wrong and we need more futher information from you.', { success: false })
        }
      } else {
        reply.success('Failed to reset your password! Please contact us, something went wrong and we need more futher information from you.', { success: false })
      }
    } else {
      reply.success('The request to reset password has been expired!', { success: false })
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
      return reply.error(err.message)
    })

    // get hash
    const decoded = server.jwt.decode(request.headers['x-token'])
    const found = await User.find({
      id: decoded.uid
    }).catch(err => {
      return reply.mongooseError(mongooseHandler.errorBuilder(err))
    })

    if (found) {
      // compare password
      const pass = await password.compare(request.body.oldpassword, found[0].hash).catch(err => {
        return reply.error(err.message)
      })

      if (pass) {
        // update password
        const updated = await User.findOneAndUpdate({
          id: decoded.uid
        }, {
          hash: await password.generate(request.body.newpassword),
          updated_at: moment().format('x')
        }, { new: true }).catch(err => {
          return reply.mongooseError(mongooseHandler.errorBuilder(err))
        })
        if (updated) {
          reply.success('Your password successfully changed!', { success: true })
        } else {
          reply.success('Failed to change your password!', { success: false })
        }
      } else {
        reply.success('Your old password is wrong!', { success: false })
      }
    } else {
      reply.forbidden('Invalid token!', { success: false })
    }

    await reply
  })

  server.post('/api/user/my-profile', {
    schema: {
      headers: authSchema.auth
    },
    preHandler: server.auth([
      server.verifyToken
    ])
  }, async (request, reply) => {
    await mongooseHandler.connect().catch(err => {
      return reply.error(err.message)
    })

    // get hash
    const decoded = server.jwt.decode(request.headers['x-token'])
    // update profile
    const profile = await User.findOne({
      id: decoded.uid
    }).catch(err => {
      return reply.mongooseError(mongooseHandler.errorBuilder(err))
    })
    if (profile) {
      profile.hash = undefined
      reply.success('Get my profile successfully!', { success: true, data: profile })
    } else {
      reply.success('Failed to get my profile!', { success: false })
    }

    await reply
  })

  server.post('/api/user/my-profile/update', {
    schema: {
      headers: authSchema.auth,
      body: schema.editProfile
    },
    preHandler: server.auth([
      server.verifyToken
    ])
  }, async (request, reply) => {
    await mongooseHandler.connect().catch(err => {
      return reply.error(err.message)
    })

    // get hash
    const decoded = server.jwt.decode(request.headers['x-token'])
    // update profile
    const updated = await User.findOneAndUpdate({
      id: decoded.uid
    }, {
      name: request.body.name,
      address: request.body.address,
      bio: request.body.bio,
      link: request.body.link,
      updated_at: moment().format('x')
    }, { new: true }).catch(err => {
      return reply.mongooseError(mongooseHandler.errorBuilder(err))
    })
    if (updated) {
      updated.hash = undefined
      reply.success('Your profile successfully updated!', { success: true, data: updated })
    } else {
      reply.success('Failed to update your profile!', { success: false })
    }

    await reply
  })
}

module.exports = userRoute
