'use strict'
const { Category } = require('@prisma/client')

module.exports = async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    console.log(Category)
    return { root: true }
  })
}
