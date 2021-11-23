const { Category } = require("@prisma/client");
module.exports = async function (fastify, opts) {
  fastify.get("/", async function (request, reply) {
    var category = [];
    Object.keys(Category).map(function (key, index) {
      key = key.replace(/(\w)(\w*)/g, function (g0, g1, g2) {
        return g1.toUpperCase() + g2.toLowerCase();
      });
      category[index] = key;
    });

    return category;
  });
  fastify.get("/:cat", async function (request, reply) {
    try {
      const getCondition = await fastify.prisma.condition.findMany({
        where: {
          category: request.params.cat,
        },
      });
      return getCondition;
    } catch (err) {
      return "Invalid Category";
    }
  });
};
