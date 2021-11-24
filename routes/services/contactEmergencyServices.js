'use strict'
const axios = require('axios');

const { Severity } = require('@prisma/client')

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

module.exports = async function (fastify, opts) {
    fastify.get('/contact', async function (request, reply) {
        try {
            const qSeverity = request.query.severity
            const sessionId = request.query.sessionId

            const session = await fastify.prisma.session.findUnique({
                where: {
                    id: parseInt(sessionId, 10)
                }
            })

            console.log(session, session.symptoms)

            const geocodeURL = `https://api.mapbox.com/geocoding/v5/mapbox.places/${session.location}.json?limit=1&access_token=${process.env.MAPBOX_TOKEN}`
            const res = await axios.get(geocodeURL)
            
            const location = res.data.place_name
            const symptoms = session.symptoms

            switch (qSeverity) {
                case Severity.POLICE:
                    break;
                case Severity.MEDICAL:
                    // client.calls
                    //     .create({
                    //         twiml: `<Response><Say>Medical help required at ${location}. Patient is ${symptoms}. Thank You</Say></Response>`,
                    //         to: '+917356862872',
                    //         from: '+13312416386'
                    //     })
                    //     .then(call => console.log(call.sid));
                    break;
                case Severity.BOTH:
                    break;
                default:
                    reply.send({ 'error': 'Invalid Severity' })
            }
            reply.send({ 'success': 'Authority Alerted' })

        } catch (error) {
            console.log(error)
            reply.send({ 'error': 'Invalid Session ID' })
        }
    })
}
