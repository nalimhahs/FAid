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
                },
                include: {
                    symptoms: true,
                }
            })

            const geocodeURL = `https://api.mapbox.com/geocoding/v5/mapbox.places/${session.location}.json?limit=1&access_token=${process.env.MAPBOX_TOKEN}`
            const res = await axios.get(geocodeURL)

            const location = res.data.features[0].place_name
            let symptoms = ''
            session.symptoms.forEach((symptom) => {
                symptoms += symptom.name + ', '
            })

            if (!symptoms) {
                return ({ 'error': 'Invalid Symptoms' })
            }

            switch (qSeverity) {
                case Severity.POLICE:
                    client.calls
                        .create({
                            twiml: `<Response><Say>Police help required at ${location}. Patient is ${symptoms}. Thank You</Say></Response>`,
                            to: '+917356862872',
                            from: '+13312416386'
                        })
                        .then(call => console.log(call.sid));
                    break;
                case Severity.MEDICAL:
                    client.calls
                        .create({
                            twiml: `<Response><Say>Medical help required at ${location}. Patient is ${symptoms}. Thank You</Say></Response>`,
                            to: '+917356862872',
                            from: '+13312416386'
                        })
                        .then(call => console.log(call.sid));
                    break;
                case Severity.BOTH:
                    client.calls
                        .create({
                            twiml: `<Response><Say>Medical and police help required at ${location}. Patient is ${symptoms}. Thank You</Say></Response>`,
                            to: '+917356862872',
                            from: '+13312416386'
                        })
                        .then(call => console.log(call.sid));
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
