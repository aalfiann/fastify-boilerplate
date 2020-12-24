/**
 * This is just example simple crud
 * to make you easier understanding with mongoose (not related with fastify boilerplate)
 */

'use strict'

// this is the mongoose wrapper class
const mongooseHandler = require('../lib/mongoose_handler')

// this is schema for validation collection contact
const Contact = require('../models/contact')

// this is schema for validation request fastify
const schema = require('../schemas/contact')

async function exampleRoute (server, options) {
  server.post('/db/add-contact', { schema: schema.addContact }, async (request, reply) => {
    const contact = {
      user_id: request.body.user_id,
      name: request.body.name,
      address: request.body.address
    }

    try {
      await mongooseHandler.connect()
    } catch (err) {
      return reply.error(err.message)
    }

    const done = Contact(contact).save().catch(err => {
      return reply.mongooseError(mongooseHandler.errorBuilder(err))
    })

    if (done) reply.success('Add data user contact success!')

    await reply
  })

  server.post('/db/edit-contact', { schema: schema.editContact }, async (request, reply) => {
    try {
      await mongooseHandler.connect()
    } catch (err) {
      return reply.error(err.message)
    }

    const done = Contact.findOneAndUpdate({
      user_id: request.body.user_id
    }, {
      name: request.body.name,
      address: request.body.address
    }, {
      new: true
    }).catch(err => {
      return reply.mongooseError(mongooseHandler.errorBuilder(err))
    })
    if (done) reply.success('Edit data user contact success!', { data: done })

    await reply
  })

  server.get('/db/get-contact/:id', { schema: schema.getContact }, async (request, reply) => {
    try {
      await mongooseHandler.connect()
    } catch (err) {
      return reply.error(err.message)
    }

    const done = Contact.find({ user_id: request.params.id }).sort({ user_id: 'desc' }).catch(err => {
      return reply.mongooseError(mongooseHandler.errorBuilder(err))
    })

    if (done) reply.success('Get data user contact success!', { data: done })

    await reply
  })

  server.get('/db/list-contact', async (request, reply) => {
    try {
      await mongooseHandler.connect()
    } catch (err) {
      return reply.error(err.message)
    }

    const done = Contact.find({}).sort({ user_id: 'desc' }).catch(err => {
      return reply.mongooseError(mongooseHandler.errorBuilder(err))
    })

    if (done) reply.success('List data user contact success!', { data: done })

    await reply
  })

  server.get('/db/search-contact', { schema: schema.searchContact }, async (request, reply) => {
    const search = decodeURIComponent(request.query.q).trim()

    try {
      await mongooseHandler.connect()
    } catch (err) {
      return reply.error(err.message)
    }

    // Query find like for name and address only (simple regex)
    const done = Contact.find({
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
      ]
    }).sort({ user_id: 'desc' }).catch(err => {
      return reply.mongooseError(mongooseHandler.errorBuilder(err))
    })

    if (done) reply.success('Result search data user contact success!', { data: done })

    await reply
  })

  server.get('/db/search-contact-function', { schema: schema.searchContact }, async (request, reply) => {
    const search = decodeURIComponent(request.query.q).trim()

    try {
      await mongooseHandler.connect()
    } catch (err) {
      return reply.error(err.message)
    }

    // Query find like for name and address only (another way of regex)
    const done = Contact.find({
      $where: 'function() { return (this.name.toString().match(/' + search + '/i) || this.address.toString().match(/' + search + '/i) ) != null; }'
    }).sort({ user_id: 'desc' }).catch(err => {
      return reply.mongooseError(mongooseHandler.errorBuilder(err))
    })

    if (done) reply.success('Result search data user contact success!', { data: done })

    await reply
  })
}

module.exports = exampleRoute
