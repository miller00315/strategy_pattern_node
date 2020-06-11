const HapiSwagger = require('hapi-swagger');
const HapiJwt = require('hapi-auth-jwt2');
const Hapi = require('@hapi/hapi');
const Vision = require('vision');
const Inert = require('inert');

const mongoHeroesSchema = require('./db/strategies/mongoDB/schemas/heroesSchema');
const postgresHeroesSchema = require('./db/strategies/postgres/schemas/heroesSchema');

const Context = require('./db/strategies/base/contextStrategy');
const MongoDB = require('./db/strategies/mongoDB/mongodb');
const HeroRoutes = require('./routes/heroRoutes');
const AuthRoutes = require('./routes/authRoutes');
const JWT_KEY = 'chavinha';

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
    HapiJwt,
    {
      plugin: HapiSwagger,
      options,
    },
  ]);

  app.auth.strategy('jwt', 'jwt', {
    keey: JWT_KEY,
    options: {},
    validate: (data, request) => {
      return {
        isValid: true,
      };
    },
  });

  app.auth.default('jwt');

  app.route([
    ...mapRoutes(new HeroRoutes(context), HeroRoutes.methods()),
    ...mapRoutes(new AuthRoutes(JWT_KEY), AuthRoutes.methods()),
  ]);

  return app;
}

module.exports = main();
