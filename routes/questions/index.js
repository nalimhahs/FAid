module.exports = async function (fastify, opts) {
  fastify.get("/", async function (request, reply) {
    var symptoms = [];
    function symptomExists(id) {
      return symptoms.some(function (el) {
        return el.id === id;
      });
    }
    //   const firstQuestion = await fastify.prisma.symptom.findMany({
    //     orderBy: {
    //       priority: "asc",
    //     },
    //     select: {
    //       question: true,
    //     },
    //   });

    if (request.query.answer) {
      const symptomName = await fastify.prisma.symptom.findMany({
        where: {
          id: parseInt(request.query.id),
        },
      });
      const symptomName1 = await fastify.prisma.symptom.findMany({
        where: {
          id: 2,
        },
      });
      const symptomName2 = await fastify.prisma.symptom.findMany({
        where: {
          id: 3,
        },
      });
      symptoms.push(symptomName1[0]);
      symptoms.push(symptomName2[0]);
      symptoms.push(symptomName[0]);

      const conditions = await fastify.prisma.symptom.findMany({
        where: { id: parseInt(request.query.id) },
        select: { condition: true },
      });
      var newSymptoms = [];
      conditions.map(async (item) => {
        const symptomsInConditions = await fastify.prisma.condition.findMany({
          where: { id: item.condition.id },
          select: { symptoms: true },
        });
        // for (var i = 0; i < symptomsInConditions.length; i++) {
        //   if (!symptoms.includes(symptomsInConditions[i])) {
        //     console.log(symptomsInConditions[i]);
        //   }
        // }
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
                  ({ id: id1 }) => !symptoms.some(({ id: id2 }) => id2 === id1)
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
        return min.treatment;
      } else {
        newSymptoms.sort((a, b) => {
          return a.priority - b.priority;
        });
        return newSymptoms[0].question;
      }
      //   console.log(conditionWithSymptom);
      // console.log(conditionWithSymptom[0].symptoms);
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
        // for (var i = 0; i < symptomsInConditions.length; i++) {
        //   if (!symptoms.includes(symptomsInConditions[i])) {
        //     console.log(symptomsInConditions[i]);
        //   }
        // }
        symptomsInConditions.map((item) => {
          item.symptoms.map((indi) => {
            if (!symptomExists(indi.id) && indi.id != request.query.id) {
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
                  ({ id: id1 }) => !symptoms.some(({ id: id2 }) => id2 === id1)
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
        return min.treatment;
      } else {
        newSymptoms.sort((a, b) => {
          return a.priority - b.priority;
        });
        return newSymptoms[0].question;
      }
    }
    // console.log(getCondition[1].name);
    // console.log(getCondition);
    // const getQuestion = await fastify.prisma.symptom.findMany({
    //   select: { question: true },
    // });
  });
};
