'use strict'

/* global describe it */
const assert = require('assert')
const hash = require('../lib/obase64')

describe('obase64 function test', function () {
  it('randomizer', async function () {
    const result = await hash._randomizer()
    assert.strictEqual(result.length, 2)
  })

  it('randomizer with size', async function () {
    const result = await hash._randomizer(2)
    assert.strictEqual(result.length, 3)
  })

  it('encode', async function () {
    await hash.encode('admin')
  })

  it('decode', async function () {
    assert.strictEqual(await hash.decode('QxzMzbjoG1pphZ2MTMjI'), 'admin')
  })
})
