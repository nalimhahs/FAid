'use strict'

module.exports = async function (fastify, opts) {
    fastify.get('/next', async function (request, reply) {
        try {
            const sessionId = request.query.sessionId;
            const symptomId = request.query.symptomId;
            const answer = request.query.answer;

            const session = await fastify.prisma.session.findUnique({
                where: {
                    id: parseInt(sessionId, 10)
                }
            })

            const symptom = await fastify.prisma.symptom.findUnique({
                where: {
                    id: parseInt(symptomId, 10)
                }
            })

            console.log(session.symptoms, session, symptom)

            const updatedSession = await fastify.prisma.session.update({
                where: {
                    id: parseInt(sessionId, 10)
                },
                data: {
                    symptoms:  symptom
                }
            })

            reply.send({ 'session_id': session.id })

        } catch (error) {
            console.error(error)
            reply.send({ 'error': 'Invalid Severity' })
        }
    })
}
