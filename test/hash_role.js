'use strict'

/* global describe it */
const assert = require('assert')
const hash = require('../lib/hash_role')

describe('hash role function test', function () {
  it('encode role', async function () {
    await hash.encode('admin')
  })

  it('decode role', async function () {
    assert.strictEqual(await hash.decode('g==g5M5NTNTUTYw46MtaWYWR'), 'admin')
  })
})
