'use strict'

module.exports = async function (fastify, opts) {
    fastify.get('/init', async function (request, reply) {
        try {
            const location = request.query.location
            const session = await fastify.prisma.session.create({
                data: {
                    location: location
                }
            })
            reply.send({ 'session_id': session.id })

        } catch (error) {
            reply.send({ 'error': 'Unable to create session' })
        }
    })
}
