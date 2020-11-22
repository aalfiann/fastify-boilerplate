'use strict'

const { v4: uuidv4 } = require('uuid')
const moment = require('moment')
const mongooseHandler = require('../lib/mongoose_handler.js')
const Menu = require('../models/menu')
const authSchema = require('../schemas/auth')
const menuSchema = require('../schemas/menu')
const obase64 = require('../lib/obase64')

async function apiRoute (server, options) {
  server.post('/api/menu/parent/add', {
    schema: {
      headers: authSchema.auth,
      body: menuSchema.parentAdd
    },
    preHandler: server.auth([
      server.verifyToken
    ])
  }, async (request, reply) => {
    await mongooseHandler.connect().catch(err => {
      return reply.code(500).send({
        message: err.message,
        statusCode: 500
      })
    })

    const data = {
      id: uuidv4(),
      name: request.body.name,
      url: request.body.url,
      type: request.body.type,
      scope: request.body.scope,
      position: request.body.position,
      icon: request.body.icon,
      status: true,
      created_at: moment().format('x')
    }

    const done = await Menu(data).save().catch(err => {
      return reply.code(400).send(mongooseHandler.errorBuilder(err))
    })

    await reply.code(200).send({
      message: 'Add new menu parent success',
      statusCode: 200,
      data: done
    })
  })

  server.post('/api/menu/parent/update', {
    schema: {
      headers: authSchema.auth,
      body: menuSchema.parentUpdate
    },
    preHandler: server.auth([
      server.verifyToken
    ])
  }, async (request, reply) => {
    await mongooseHandler.connect().catch(err => {
      return reply.code(500).send({
        message: err.message,
        statusCode: 500
      })
    })

    const done = await Menu.findOneAndUpdate({ id: request.body.id }, {
      name: request.body.name,
      url: request.body.url,
      type: request.body.type,
      scope: request.body.scope,
      position: request.body.position,
      status: request.body.status,
      icon: request.body.icon,
      updated_at: moment().format('x')
    }, { new: true }).catch(err => {
      return reply.code(400).send(mongooseHandler.errorBuilder(err))
    })

    await reply.code(200).send({
      message: 'Update menu parent success',
      statusCode: 200,
      data: done
    })
  })

  server.post('/api/menu/parent/delete', {
    schema: {
      headers: authSchema.auth,
      body: menuSchema.parentDelete
    },
    preHandler: server.auth([
      server.verifyToken
    ])
  }, async (request, reply) => {
    await mongooseHandler.connect().catch(err => {
      return reply.code(500).send({
        message: err.message,
        statusCode: 500
      })
    })

    const done = await Menu.findOneAndDelete({ id: request.body.id }).catch(err => {
      return reply.code(400).send(mongooseHandler.errorBuilder(err))
    })

    await reply.code(200).send({
      message: 'Delete menu parent success',
      statusCode: 200,
      data: done
    })
  })

  server.post('/api/menu/parent/set-menu-child', {
    schema: {
      headers: authSchema.auth,
      body: menuSchema.parentChild
    },
    preHandler: server.auth([
      server.verifyToken
    ])
  }, async (request, reply) => {
    await mongooseHandler.connect().catch(err => {
      return reply.code(500).send({
        message: err.message,
        statusCode: 500
      })
    })

    const done = await Menu.findOneAndUpdate({ id: request.body.id }, {
      child: request.body.child,
      updated_at: moment().format('x')
    }, { new: true }).catch(err => {
      return reply.code(400).send(mongooseHandler.errorBuilder(err))
    })

    await reply.code(200).send({
      message: 'Set menu child success',
      statusCode: 200,
      data: done
    })
  })

  server.post('/api/menu/parent/set-status', {
    schema: {
      headers: authSchema.auth,
      body: menuSchema.parentStatus
    },
    preHandler: server.auth([
      server.verifyToken
    ])
  }, async (request, reply) => {
    await mongooseHandler.connect().catch(err => {
      return reply.code(500).send({
        message: err.message,
        statusCode: 500
      })
    })

    const done = await Menu.findOneAndUpdate({ id: request.body.id }, {
      status: request.body.status,
      updated_at: moment().format('x')
    }, { new: true }).catch(err => {
      return reply.code(400).send(mongooseHandler.errorBuilder(err))
    })

    await reply.code(200).send({
      message: 'Set status menu parent success',
      statusCode: 200,
      data: done
    })
  })

  server.get('/api/menu/parent/list', {
    schema: {
      headers: authSchema.auth
    },
    preHandler: server.auth([
      server.verifyToken
    ])
  }, async (request, reply) => {
    await mongooseHandler.connect().catch(err => {
      return reply.code(500).send({
        message: err.message,
        statusCode: 500
      })
    })

    const result = await Menu.find({}).sort({ position: 'asc' }).catch(err => {
      return reply.code(400).send(mongooseHandler.errorBuilder(err))
    })

    await reply.code(200).send({
      message: 'Get list menu parent success',
      statusCode: 200,
      data: result
    })
  })

  server.get('/api/menu/parent/list-by-role', {
    schema: {
      headers: authSchema.auth
    },
    preHandler: server.auth([
      server.verifyToken
    ])
  }, async (request, reply) => {
    const userRole = obase64.decode(server.jwt.verify(request.headers['x-token']).role)
    await mongooseHandler.connect().catch(err => {
      return reply.code(500).send({
        message: err.message,
        statusCode: 500
      })
    })

    const result = await Menu.find({
      $where: 'function() { return this.scope.toString().match(/' + userRole + '/i) != null; }'
    }).sort({ position: 'asc' }).catch(err => {
      return reply.code(400).send(mongooseHandler.errorBuilder(err))
    })

    await reply.code(200).send({
      message: 'Get list menu parent by role success',
      statusCode: 200,
      data: result
    })
  })
}

module.exports = apiRoute
