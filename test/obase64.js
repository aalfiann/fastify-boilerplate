'use strict'

/* global describe it */
const assert = require('assert')
const hash = require('../lib/obase64')

describe('obase64 function test', function () {
  it('randomizer', async function () {
    const result = hash._randomizer()
    assert.strictEqual(result.length, 2)
  })

  it('randomizer with size 1', async function () {
    const result = hash._randomizer(1)
    assert.strictEqual(result.length, 2)
  })

  it('randomizer with size 2', async function () {
    const result = hash._randomizer(2)
    assert.strictEqual(result.length, 3)
  })

  it('randomizer with size 5', async function () {
    const result = hash._randomizer(5)
    assert.strictEqual(result.length, 6)
  })

  it('encode', async function () {
    await hash.encode('admin')
  })

  it('decode', async function () {
    assert.strictEqual(await hash.decode('QxzMzbjoG1pphZ2MTMjI'), 'admin')
  })
})
