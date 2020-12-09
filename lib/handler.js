/**
 * Handler Library will help you to standardize the output response
 */
'use strict'

/**
 * Reply Success (200)
 * @param {response} reply      this is the response from Fastify
 * @param {string} message      this is the message
 * @param {object} obj          this is the additional data [Optional]
 * @return {response}           Promise or Synchronous
 */
function success (reply, message, obj) {
  return custom(reply, message, 200, obj)
}

/**
 * Reply Bad Request (400)
 * @param {response} reply      this is the response from Fastify
 * @param {string} message      this is the message
 * @param {object} obj          this is the additional data [Optional]
 * @return {response}           Promise or Synchronous
 */
function badRequest (reply, message, obj) {
  const newdata = {
    error: 'Bad Request'
  }
  Object.assign(newdata, obj)
  return custom(reply, message, 400, newdata)
}

/**
 * Reply Unauthorized (401)
 * @param {response} reply      this is the response from Fastify
 * @param {string} message      this is the message
 * @param {object} obj          this is the additional data [Optional]
 * @return {response}           Promise or Synchronous
 */
function unauthorized (reply, message, obj) {
  const newdata = {
    error: 'Unauthorized'
  }
  Object.assign(newdata, obj)
  return custom(reply, message, 401, newdata)
}

/**
 * Reply Forbidden (403)
 * @param {response} reply      this is the response from Fastify
 * @param {string} message      this is the message
 * @param {object} obj          this is the additional data [Optional]
 * @return {response}           Promise or Synchronous
 */
function forbidden (reply, message, obj) {
  const newdata = {
    error: 'Forbidden'
  }
  Object.assign(newdata, obj)
  return custom(reply, message, 403, newdata)
}

/**
 * Reply Not Found (404)
 * @param {response} reply      this is the response from Fastify
 * @param {string} message      this is the message
 * @param {object} obj          this is the additional data [Optional]
 * @return {response}           Promise or Synchronous
 */
function notFound (reply, message, obj) {
  const newdata = {
    error: 'Not Found'
  }
  Object.assign(newdata, obj)
  return custom(reply, message, 404, newdata)
}

/**
 * Reply Error
 * @param {response} reply      this is the response from Fastify
 * @param {string} message      this is the message
 * @param {object} obj          this is the additional data [Optional]
 * @return {response}           Promise or Synchronous
 */
function error (reply, message, obj) {
  const newdata = {
    error: 'Internal Server Error'
  }
  Object.assign(newdata, obj)
  return custom(reply, message, 500, newdata)
}

/**
 * Reply Custom
 * @param {response} reply      this is the response from Fastify
 * @param {string} message      this is the message
 * @param {integer} code        this is the http/status code
 * @param {object} obj          this is the additional data [Optional]
 * @return {response}           Promise or Synchronous
 */
function custom (reply, message, code, obj) {
  const data = {
    message: message,
    statusCode: code
  }
  Object.assign(data, obj)
  return reply.code(code).send(data)
}

/**
 * Reply Raw JSON
 * @param {response} reply      this is the response from Fastify
 * @param {intger} code         this is the http/status code
 * @param {object} json         this is the json
 * @return {response}           Promise or Synchronous
 */
function raw (reply, code, json) {
  return reply.code(code).send(json)
}

/**
 * Reply for Mongoose Error
 * @param {response} reply      this is the response from Fastify
 * @param {object} json         this is the json
 * @return {response}           Promise or Synchronous
 */
function mongooseError (reply, json) {
  return raw(reply, 400, json)
}

/**
 * Reply for HTML
 * @param {response} reply      this is the response from Fastify
 * @param {string} html         this the html string
 * @param {integer} code        this the http/status code. Default is 200
 * @return {response}           Promise or Synchronous
 */
function html (reply, html, code = 200) {
  return reply.code(code).header('Content-Type', 'text/html; charset=utf-8').send(html)
}

/**
 * Reply for XML
 * @param {response} reply      this is the response from Fastify
 * @param {string} xml          this the xml string
 * @param {integer} code        this the http/status code. Default is 200
 * @return {response}           Promise or Synchronous
 */
function xml (reply, xml, code = 200) {
  return reply.code(code).header('Content-Type', 'text/xml').send(xml)
}

/**
 * Reply for Txt
 * @param {response} reply      this is the response from Fastify
 * @param {string} txt          this the txt string
 * @param {integer} code        this the http/status code. Default is 200
 * @return {response}           Promise or Synchronous
 */
function txt (reply, txt, code = 200) {
  return reply.code(code).header('Content-Type', 'text/plain').send(txt)
}

module.exports = {
  success,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  error,
  custom,
  raw,
  html,
  xml,
  txt,
  mongooseError
}
