"use strict";

module.exports = async function (fastify, opts) {
  fastify.get("/next", async function (request, reply) {
    try {
      const sessionId = request.query.sessionId;
      const symptomId = request.query.symptomId;
      const answer = request.query.answer;

      const session = await fastify.prisma.session.findUnique({
        where: {
          id: parseInt(sessionId, 10),
        },
        include: {
          symptoms: true,
        },
      });

      const symptom = await fastify.prisma.symptom.findUnique({
        where: {
          id: parseInt(symptomId, 10),
        },
        include: {
          condition: true,
        },
      });

      let question = null;

      function symptomExists(id) {
        return session.symptoms.some(function (el) {
          return el.id === id;
        });
      }

      if (answer) {
        const updatedSession = await fastify.prisma.session.update({
          where: {
            id: parseInt(sessionId, 10),
          },
          data: {
            symptoms: {
              connect: { id: symptom.id }
            }
          },
        });

        const conditions = symptom.condition
        var newSymptoms = [];
        conditions.map(async (item) => {
          const symptomsInConditions = await fastify.prisma.condition.findMany({
            where: { id: item.condition.id },
            select: { symptoms: true },
          });

          symptomsInConditions.map((item) => {
            item.symptoms.map((indi) => {
              if (!symptomExists(indi.id)) {
                newSymptoms.push(indi);
              }
            });
          });
        });
        if (newSymptoms.length == 0) {
          const conditionWithSymptom = await fastify.prisma.condition.findMany({
            include: { symptoms: true, treatment: true },
          });
          console.log(conditionWithSymptom);
          var min = conditionWithSymptom[0];
          console.log(conditionWithSymptom[0].symptoms[0].id);
          console.log(symptoms);
          var minLength =
            conditionWithSymptom[0].symptoms.length > symptoms.length
              ? conditionWithSymptom[0].symptoms.filter(
                ({ id: id1 }) => !symptoms.some(({ id: id2 }) => id2 === id1)
              )
              : symptoms.filter(
                ({ id: id1 }) =>
                  !conditionWithSymptom[0].symptoms.some(
                    ({ id: id2 }) => id2 === id1
                  )
              );
          conditionWithSymptom.map(async (item) => {
            var results =
              item.symptoms.length > symptoms.length
                ? item.symptoms.filter(
                  ({ id: id1 }) =>
                    !symptoms.some(({ id: id2 }) => id2 === id1)
                )
                : symptoms.filter(
                  ({ id: id1 }) =>
                    !item.symptoms.some(({ id: id2 }) => id2 === id1)
                );
            if (results.length < minLength.length) {
              minLength = results;
              min = item;
            }
          });
          reply.send({ session_id: session.id, treatment: min.treatment });
        } else {
          newSymptoms.sort((a, b) => {
            return a.priority - b.priority;
          });
          question = newSymptoms[0];
        }

      } else {
        const conditions = await fastify.prisma.symptom.findMany({
          where: { id: symptoms[symptoms.length - 1].id },
          select: { condition: true },
        });
        var newSymptoms = [];
        conditions.map(async (item) => {
          const symptomsInConditions = await fastify.prisma.condition.findMany({
            where: { id: item.condition.id },
            select: { symptoms: true },
          });

          symptomsInConditions.map((item) => {
            item.symptoms.map((indi) => {
              if (!symptomExists(indi.id)) {
                newSymptoms.push(indi);
              }
            });
          });
        });
        if (newSymptoms.length == 0) {
          const conditionWithSymptom = await fastify.prisma.condition.findMany({
            include: { symptoms: true, treatment: true },
          });
          console.log(conditionWithSymptom);
          var min = conditionWithSymptom[0];
          console.log(conditionWithSymptom[0].symptoms[0].id);
          console.log(symptoms);
          var minLength =
            conditionWithSymptom[0].symptoms.length > symptoms.length
              ? conditionWithSymptom[0].symptoms.filter(
                ({ id: id1 }) => !symptoms.some(({ id: id2 }) => id2 === id1)
              )
              : symptoms.filter(
                ({ id: id1 }) =>
                  !conditionWithSymptom[0].symptoms.some(
                    ({ id: id2 }) => id2 === id1
                  )
              );
          conditionWithSymptom.map(async (item) => {
            var results =
              item.symptoms.length > symptoms.length
                ? item.symptoms.filter(
                  ({ id: id1 }) =>
                    !symptoms.some(({ id: id2 }) => id2 === id1)
                )
                : symptoms.filter(
                  ({ id: id1 }) =>
                    !item.symptoms.some(({ id: id2 }) => id2 === id1)
                );
            if (results.length < minLength.length) {
              minLength = results;
              min = item;
            }
          });
          reply.send({ session_id: session.id, treatment: min.treatment });
        } else {
          newSymptoms.sort((a, b) => {
            return a.priority - b.priority;
          });
          question = newSymptoms[0];
        }
      }

      reply.send({ session_id: session.id, question: question });
    } catch (error) {
      console.error(error);
      reply.send({ error: "Invalid Severity" });
    }
  });
};
