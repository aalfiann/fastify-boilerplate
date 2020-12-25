'use strict'

const mongoose = require('mongoose')
const cachegoose = require('recachegoose')
const config = require('../config.js')
const MongooseSchema = mongoose.Schema

if (config.mongoCache.useRedis) {
  cachegoose(mongoose, config.mongoCache.redisConfig)
} else {
  cachegoose(mongoose)
}

/**
 * Connection String Builder for MongoDB
 * @param {object} mongoDBConn  this is the mongodb connection object (see your config for mongoDBConn).
 * @return {string}
 */
function _connBuilder (mongoDBConn) {
  let conn = 'mongodb://'
  if (Object.prototype.hasOwnProperty.call(mongoDBConn, 'user') && mongoDBConn.user.toString().trim() !== '') {
    conn = conn + mongoDBConn.user
  }
  if (Object.prototype.hasOwnProperty.call(mongoDBConn, 'pass') && mongoDBConn.pass.toString().trim() !== '') {
    conn = conn + ':' + mongoDBConn.pass + '@'
  }
  if (Object.prototype.hasOwnProperty.call(mongoDBConn, 'host') && mongoDBConn.host.toString().trim() !== '') {
    conn = conn + mongoDBConn.host
  } else {
    throw new Error('Host for MongoDB is required!')
  }
  if (Object.prototype.hasOwnProperty.call(mongoDBConn, 'port') && mongoDBConn.port.toString().trim() !== '') {
    conn = conn + ':' + mongoDBConn.port
  } else {
    throw new Error('Port for MongoDB is required!')
  }
  if (Object.prototype.hasOwnProperty.call(mongoDBConn, 'database') && mongoDBConn.database.toString().trim() !== '') {
    conn = conn + '/' + mongoDBConn.database
  } else {
    throw new Error('Database Name for MongoDB is required!')
  }
  return conn
}

/**
 * Make a connection to MongoDB
 * @param {(err: MongoError)} callback
 * @return pseudo promise wrapper around this
 */
function connect (callback) {
  if (callback && typeof callback === 'function') {
    return mongoose.connect(_connBuilder(config.mongoDBConn), config.mongoDBOptions, callback)
  }
  return mongoose.connect(_connBuilder(config.mongoDBConn), config.mongoDBOptions)
}

/**
 * Close connection from MongoDB
 * @param {(err: MongoError)} callback
 * @return pseudo promise wrapper around this
 */
function close (callback) {
  if (callback && typeof callback === 'function') {
    return mongoose.connection.close(callback)
  }
  return mongoose.connection.close()
}

/**
 * Transform document object
 * @param {*} doc
 * @param {*} ret
 * @return {object}
 */
function _transform (doc, ret) {
  ret._id = doc._id.toString()
  return ret
}

/**
 * Create Mongoose schema
 * @param {object} obj
 * @return {schema}
 */
function createSchema (obj) {
  const schema = new MongooseSchema(obj, {
    toObject: { _transform },
    toJSON: { _transform }
  })

  schema.set('toObject', { virtuals: true })
  return schema
}

/**
 * Set Mongoose model
 * @param {string} name
 * @param {object} schema
 * @return {model}
 */
function setModel (name, schema) {
  return mongoose.model(name, createSchema(schema))
}

/**
 * Error query builder from Mongoose to Fastify formatted
 * @param {object} err          this is the error object from Mongoose Error
 * @return {object}
 */
function errorBuilder (err) {
  const error = {
    statusCode: 400,
    message: (err.errmsg) ? err.errmsg : (err.name) ? err.name : 'Unknown error!',
    error: {
      driver: err.driver,
      name: err.name,
      index: err.index,
      keyPattern: err.keyPattern,
      keyValue: err.keyValue
    }
  }
  return error
}

/**
 * Clear Cache
 * @param {string} key
 * @param {callback} cb
 */
function clearCache (key, cb) {
  return cachegoose.clearCache(key, cb)
}

module.exports = {
  connect,
  close,
  createSchema,
  setModel,
  errorBuilder,
  clearCache,
  mongoose
}
