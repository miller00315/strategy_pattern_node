const HapiSwagger = require('hapi-swagger');

const Hapi = require('@hapi/hapi');
const Vision = require('vision');
const Inert = require('inert');

const mongoHeroesSchema = require('./db/strategies/mongoDB/schemas/heroesSchema');
const postgresHeroesSchema = require('./db/strategies/postgres/schemas/heroesSchema');

const Context = require('./db/strategies/base/contextStrategy');
const MongoDB = require('./db/strategies/mongoDB/mongodb');
const HeroRoutes = require('./routes/heroRoutes');

const app = new Hapi.Server({
  port: 3000,
});

function mapRoutes(instance, methods) {
  return methods.map((method) => instance[method]());
}

const options = {
  info: {
    title: 'API HEROES',
    version: 'v1.0',
  },
  lang: 'pt-br',
};

async function main() {
  const connection = MongoDB.connect();
  const context = new Context(new MongoDB(connection, mongoHeroesSchema));
  await app.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options,
    },
  ]);

  app.route(mapRoutes(new HeroRoutes(context), HeroRoutes.methods()));

  return app;
}

module.exports = main();
