'use strict'

const parentAdd = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    url: { type: 'string' },
    type: { type: 'string' },
    scope: { type: 'string' },
    icon: { type: 'string' },
    position: { type: 'number' }
  },
  required: ['name', 'url', 'type', 'scope', 'icon', 'position']
}

const parentUpdate = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    url: { type: 'string' },
    type: { type: 'string' },
    scope: { type: 'string' },
    status: { type: 'boolean' },
    icon: { type: 'string' },
    position: { type: 'number' }
  },
  required: ['id', 'name', 'url', 'type', 'scope', 'status', 'icon', 'position']
}

const parentDelete = {
  type: 'object',
  properties: {
    id: { type: 'string' }
  },
  required: ['id']
}

const parentStatus = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    status: { type: 'boolean' }
  },
  required: ['id', 'status']
}

const parentChild = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    child: { type: 'array' }
  },
  required: ['id', 'child']
}

module.exports = {
  parentAdd,
  parentUpdate,
  parentDelete,
  parentStatus,
  parentChild
}
