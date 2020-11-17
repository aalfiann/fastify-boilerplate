'use strict'

/**
 * OBase64 means Obfuscated Base64
 */

const textObfuscator = require('text-obfuscator')
const base64 = require('base-64')

/**
 * Randomizer Number
 * @param {integer} size this is the size digit randomizer
 * @return {string}
 */
function _randomizer (size) {
  size = (size === undefined) ? 1 : size
  let a = 10
  for (let i = 1; i < size; i++) {
    a = a * 10
  }
  const b = (a * 9)
  const c = (a - 1)
  return (Math.floor(a + Math.random() * (b + c))).toString()
}

/**
 * Encode string
 * @param {string} text this is the text value
 * @return {string}
 */
function encode (text) {
  const randomizer1 = _randomizer(3)
  const randomizer2 = _randomizer(3)
  return textObfuscator.encode(base64.encode(randomizer1 + ':' + text + ':' + randomizer2), 3)
}

/**
 * Decode hashed string
 * @param {string} hashed this is the hashed value
 * @return {string}
 */
function decode (hashed) {
  return base64.decode(textObfuscator.decode(hashed, 3)).split(':')[1]
}

module.exports = {
  _randomizer,
  encode,
  decode
}
