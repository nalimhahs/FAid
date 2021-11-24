'use strict'

module.exports = async function (fastify, opts) {
    fastify.get('/next', async function (request, reply) {
        try {
            const sessionId = request.query.sessionId;
            const symptomId = request.query.symptomId;
            const answer = request.query.answer;

            const session = await fastify.prisma.session.findUnique({
                where: {
                    id: sessionId
                }
            })

            const symptom = await fastify.prisma.symptom.findUnique({
                where: {
                    id: symptomId
                }
            })

            console.log(session.symptoms)

            const updatedSession = await fastify.prisma.session.update({
                where: {
                    id: sessionId
                },
                data: {
                    symptoms: [...session.symptoms, symptom]
                }
            })

            reply.send({ 'session_id': session.id })

        } catch (error) {
            reply.send({ 'error': 'Invalid Severity' })
        }
    })
}
