'use strict'
const { Severity } = require('@prisma/client')

module.exports = async function (fastify, opts) {
    fastify.get('/contact', async function (request, reply) {
        try {
            const qSeverity = request.query.severity
            switch (qSeverity) {
                case Severity.POLICE:
                    break;
                case Severity.MEDICAL:
                    break;
                case Severity.BOTH:
                    break;
                default:
                    reply.send({ 'error': 'Invalid Severity' })
            }
            reply.send({ 'success': 'Authority Alerted' })

        } catch (error) {
            reply.send({ 'error': 'Invalid Severity' })
        }
    })
}
