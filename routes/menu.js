'use strict'

const { v4: uuidv4 } = require('uuid')
const moment = require('moment')
const handler = require('../lib/handler')
const mongooseHandler = require('../lib/mongoose_handler')
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
      return handler.error(reply, err.message)
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
      return handler.mongooseError(reply, mongooseHandler.errorBuilder(err))
    })

    await handler.success(reply, 'Add new menu parent success!', { data: done })
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
      return handler.error(reply, err.message)
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
      return handler.mongooseError(reply, mongooseHandler.errorBuilder(err))
    })

    await handler.success(reply, 'Update menu parent success', { data: done })
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
      return handler.error(reply, err.message)
    })

    const done = await Menu.findOneAndDelete({ id: request.body.id }).catch(err => {
      return handler.mongooseError(reply, mongooseHandler.errorBuilder(err))
    })

    await handler.success(reply, 'Delete menu parent success!', { data: done })
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
      return handler.error(reply, err.message)
    })

    const done = await Menu.findOneAndUpdate({ id: request.body.id }, {
      child: request.body.child,
      updated_at: moment().format('x')
    }, { new: true }).catch(err => {
      return handler.mongooseError(reply, mongooseHandler.errorBuilder(err))
    })

    await handler.success(reply, 'Set menu child success!', { data: done })
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
      return handler.error(reply, err.message)
    })

    const done = await Menu.findOneAndUpdate({ id: request.body.id }, {
      status: request.body.status,
      updated_at: moment().format('x')
    }, { new: true }).catch(err => {
      return handler.mongooseError(reply, mongooseHandler.errorBuilder(err))
    })

    await handler.success(reply, 'Set status menu parent success!', { data: done })
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
      return handler.error(reply, err.message)
    })

    const result = await Menu.find({}).sort({ position: 'asc' }).catch(err => {
      return handler.mongooseError(reply, mongooseHandler.errorBuilder(err))
    })

    await handler.success(reply, 'Get list menu parent success!', { data: result })
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
      return handler.error(reply, err.message)
    })

    const result = await Menu.find({
      $where: 'function() { return this.scope.toString().match(/' + userRole + '/i) != null; }'
    }).sort({ position: 'asc' }).catch(err => {
      return handler.mongooseError(reply, mongooseHandler.errorBuilder(err))
    })

    await handler.success(reply, 'Get list menu parent by role success!', { data: result })
  })
}

module.exports = apiRoute
