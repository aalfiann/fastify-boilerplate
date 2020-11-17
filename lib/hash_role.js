'use strict'

const textObfuscator = require('text-obfuscator')
const base64 = require('base-64')
const moment = require('moment')

/**
 * Encode role type
 * @param {string} role this is the role type
 * @return {string}
 */
function encode (role) {
  return textObfuscator.encode(base64.encode(role + ':' + moment().unix()), 3)
}

/**
 * Decode hashed role
 * @param {string} hashed this is the hashed role
 * @return {string}
 */
function decode (hashed) {
  return base64.decode(textObfuscator.decode(hashed, 3)).split(':')[0]
}

module.exports = {
  encode,
  decode
}
