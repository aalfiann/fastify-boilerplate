'use strict'

const { v4: uuidv4 } = require('uuid')
const moment = require('moment')
const helper = require('../lib/password')
const mongooseHandler = require('../lib/mongoose_handler.js')
const User = require('../models/user')
const password = require('../lib/password')
const schema = require('../schemas/user')

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
          token = server.jwt.sign({ uid: result[0].id })
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

  // server.register(require('fastify-auth'))
  // server.decorate('verifyToken', async function (request, reply) {
  //   console.log('executed 1')
  // })

  // server.ready(err => {
  //   if (err) throw err
  //   server.addHook('preHandler', server.auth([server.verifyToken]))
  // })

  // server.addHook('preHandler', server.auth([server.verifyToken]))

  // server.post('/api/user/verify', {
  //   schema: schema.auth
  //   // preHandler: server.auth([
  //   //   async function (request, reply) { console.log('executed 1') }
  //   // ], { relation: 'and' })
  // }, async (request, reply) => {
  //   await reply.code(200).send({
  //     message: 'Verify user success!',
  //     statusCode: 200
  //   })
  // })
}

module.exports = userRoute
