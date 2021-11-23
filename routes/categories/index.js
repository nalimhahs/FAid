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
  fastify.get("/sa", async function (request, reply) {
    return "sad";
  });
};
