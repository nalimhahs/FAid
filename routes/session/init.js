"use strict";

module.exports = async function (fastify, opts) {
  fastify.get("/init", async function (request, reply) {
    try {
      const location = request.query.location;
      const session = await fastify.prisma.session.create({
        data: {
          location: location,
          timestamp: new Date(),
        },
      });
      const firstQuestion = await fastify.prisma.symptom.findMany({
        orderBy: {
          priority: "asc",
        },
      });
      reply.send({ session_id: session.id, symptom: firstQuestion[0] });
    } catch (error) {
      console.error(error);
      reply.send({ error: "Unable to create session" });
    }
  });
};
