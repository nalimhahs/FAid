'use strict'
const { Category } = require('@prisma/client')

module.exports = async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    const data = fastify.prisma.condition
    console.log(data)
    return { root: true }
  })
}
