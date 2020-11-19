'use strict'

const { v4: uuidv4 } = require('uuid')
const moment = require('moment')
const helper = require('../lib/password')
const mongooseHandler = require('../lib/mongoose_handler.js')
const User = require('../models/user')
const password = require('../lib/password')
const schema = require('../schemas/user')
const obase64 = require('../lib/obase64')

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
    mongooseHandler.connect().then(done => {
      return User.estimatedDocumentCount()
    }).then(result => {
      if (result === 0) {
        user.role = 'admin'
      } else {
        user.role = 'member'
      }
      return result
    }).then(done => {
      User(user).save().then(done => {
        reply.code(200).send({
          message: 'Register new user success!',
          statusCode: 200
        })
      }).catch(err => {
        reply.code(400).send(mongooseHandler.errorBuilder(err))
      })
    }).catch(err => {
      reply.code(500).send({
        message: err.message,
        statusCode: 500
      })
    })
    await reply
  })

  server.post('/api/user/login', { schema: schema.login }, async (request, reply) => {
    let token = ''
    mongooseHandler.connect().then(done => {
      User.find({
        $or: [
          { username: request.body.username },
          { email: request.body.username }
        ]
      }).then(result => {
        if (result.length > 0) {
          token = server.jwt.sign({
            uid: result[0].id,
            unm: result[0].username,
            name: result[0].name,
            mail: result[0].email,
            role: obase64.encode(result[0].role)
          })
          return password.compare(request.body.password, result[0].hash)
        } else {
          return false
        }
      }).then(done => {
        if (done) {
          server.jwt.verify(token, function (err, decoded) {
            if (err) {
              return reply.code(403).send({
                message: err.message,
                statusCode: 400,
                success: done
              })
            };
            reply.code(200).send({
              message: 'Login user success!',
              statusCode: 200,
              success: done,
              token: token,
              expire: decoded.exp
            })
          })
        } else {
          reply.code(403).send({
            message: 'Wrong username or password!',
            statusCode: 403,
            success: done
          })
        }
      }).catch(err => {
        reply.code(400).send(mongooseHandler.errorBuilder(err))
      })
    }).catch(err => {
      reply.code(500).send({
        message: err.message,
        statusCode: 500
      })
    })
    await reply
  })

  server.get('/api/user/check-username/:username', { schema: schema.checkUsername }, async (request, reply) => {
    mongooseHandler.connect().then(done => {
      return User.find({ username: request.params.username })
    }).then(result => {
      reply.code(200).send({
        message: (result.length > 0) ? 'Username is not available!' : 'Username is OK!',
        statusCode: 200,
        data: {
          total: result.length
        }
      })
    }).catch(err => {
      reply.code(500).send({
        message: err.message,
        statusCode: 500
      })
    })
    await reply
  })

  server.get('/api/user/check-email/:email', { schema: schema.checkEmail }, async (request, reply) => {
    mongooseHandler.connect().then(done => {
      return User.find({ email: request.params.email })
    }).then(result => {
      reply.code(200).send({
        message: (result.length > 0) ? 'Email address is not available!' : 'Email address is OK!',
        statusCode: 200,
        data: {
          total: result.length
        }
      })
    }).catch(err => {
      reply.code(500).send({
        message: err.message,
        statusCode: 500
      })
    })
    await reply
  })
}

module.exports = userRoute
