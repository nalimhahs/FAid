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
      var newSymptoms = [];
      const symptom = await fastify.prisma.symptom.findUnique({
        where: {
          id: parseInt(symptomId, 10),
        },
        include: {
          condition: true,
        },
      });

      let question = null;
      const symptoms = session.symptoms;

      function symptomExists(id) {
        return session.symptoms.some(function (el) {
          return el.id === id;
        });
      }

      if (answer === "1") {
        const updatedSession = await fastify.prisma.session.update({
          where: {
            id: parseInt(sessionId, 10),
          },
          data: {
            symptoms: {
              connect: { id: symptom.id },
            },
          },
        });

        const conditions = symptom.condition;

        conditions.map(async (item) => {
          const symptomsInConditions = await fastify.prisma.condition.findMany({
            where: { id: item.id },
            select: { symptoms: true },
          });

          symptomsInConditions.map((item) => {
            item.symptoms.map((indi) => {
              if (!symptomExists(indi.id) && indi.id != symptom.id) {
                newSymptoms.push(indi);
              }
            });
          });
        });

        setTimeout(async () => {
          console.log(newSymptoms.length + "233");

          if (newSymptoms.length == 0) {
            const conditionWithSymptom =
              await fastify.prisma.condition.findMany({
                include: { symptoms: true, treatment: true },
              });
            const sessionAgain = await fastify.prisma.session.findUnique({
              where: {
                id: parseInt(sessionId, 10),
              },
              include: {
                symptoms: true,
              },
            });
            console.log(conditionWithSymptom);
            var min = conditionWithSymptom[0];
            console.log(conditionWithSymptom[0].symptoms[0].id);
            var minLength =
              conditionWithSymptom[0].symptoms.length >
              sessionAgain.symptoms.length
                ? conditionWithSymptom[0].symptoms.filter(
                    ({ id: id1 }) =>
                      !sessionAgain.symptoms.some(({ id: id2 }) => id2 === id1)
                  )
                : sessionAgain.symptoms.filter(
                    ({ id: id1 }) =>
                      !conditionWithSymptom[0].symptoms.some(
                        ({ id: id2 }) => id2 === id1
                      )
                  );
            conditionWithSymptom.map(async (item) => {
              var results =
                item.symptoms.length > sessionAgain.symptoms.length
                  ? item.symptoms.filter(
                      ({ id: id1 }) =>
                        !sessionAgain.symptoms.some(
                          ({ id: id2 }) => id2 === id1
                        )
                    )
                  : sessionAgain.symptoms.filter(
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
        }, 800);
      } else {
        if (symptoms.length === 0) {
          const firstQuestion = await fastify.prisma.symptom.findMany({
            orderBy: {
              priority: "asc",
            },
          });
          firstQuestion.map((item, index) => {
            if (parseInt(item.id) == parseInt(symptom.id)) {
              question = firstQuestion[index + 1];
            }
          });
        } else {
          const conditions = await fastify.prisma.symptom.findMany({
            where: { id: session.symptoms[session.symptoms.length - 1].id },
            select: { condition: true },
          });
          var newSymptoms = [];

          conditions.map(async (item) => {
            const symptomsInConditions =
              await fastify.prisma.condition.findMany({
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
          setTimeout(async () => {
            console.log(newSymptoms);
            newSymptoms.sort((a, b) => {
              return a.priority - b.priority;
            });
            newSymptoms.map(async (item, index) => {
              if (parseInt(item.id) == parseInt(symptom.id)) {
                if (index != newSymptoms.length - 1) {
                  console.log(item);
                  question = newSymptoms[index + 1];
                } else {
                  const conditionWithSymptom =
                    await fastify.prisma.condition.findMany({
                      include: { symptoms: true, treatment: true },
                    });
                  console.log(conditionWithSymptom);
                  var min = conditionWithSymptom[0];
                  console.log(conditionWithSymptom[0].symptoms[0].id);
                  console.log(symptoms);
                  var minLength =
                    conditionWithSymptom[0].symptoms.length > symptoms.length
                      ? conditionWithSymptom[0].symptoms.filter(
                          ({ id: id1 }) =>
                            !symptoms.some(({ id: id2 }) => id2 === id1)
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
                  console.log(min);
                  reply.send({
                    session_id: session.id,
                    treatment: min.treatment,
                  });
                }
              }
            });
          }, 600);
        }
      }

      setTimeout(() => {
        if (question != null) {
          reply.send({ session_id: session.id, symptom: question });
        }
      }, 1000);
    } catch (error) {
      console.error(error);
      reply.send({ error: "Invalid Severity" });
    }
  });
};
