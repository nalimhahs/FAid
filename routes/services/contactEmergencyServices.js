'use strict'
const { Severity } = require('@prisma/client')

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

module.exports = async function (fastify, opts) {
    fastify.get('/contact', async function (request, reply) {
        try {
            const qSeverity = request.query.severity
            switch (qSeverity) {
                case Severity.POLICE:
                    break;
                case Severity.MEDICAL:
                    client.calls
                        .create({
                            twiml: `<Response><Say>Medical help required at ${''}. Patient is ${''}</Say></Response>`,
                            to: '+917356862872',
                            from: '+13312416386'
                        })
                        .then(call => console.log(call.sid));
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
