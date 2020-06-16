const { join } = require('path');
const { config } = require('dotenv');
const { ok } = require('assert');

const env = process.env.NODE_ENV || 'dev';

ok(env === 'prod' || env === 'dev', 'Enviorment inválida! Ou dev ou prod');

const configPath = join('./config', `.env.${env}`);

config({
  path: configPath,
});

const HapiSwagger = require('hapi-swagger');
const HapiJwt = require('hapi-auth-jwt2');
const Hapi = require('@hapi/hapi');
const Vision = require('vision');
const Inert = require('inert');

const mongoHeroesSchema = require('./db/strategies/mongoDB/schemas/heroesSchema');
const postgresHeroesSchema = require('./db/strategies/postgres/schemas/heroesSchema');

const Context = require('./db/strategies/base/contextStrategy');
const MongoDB = require('./db/strategies/mongoDB/mongodb');
const PostgresDB = require('./db/strategies/postgres/postgres');
const HeroRoutes = require('./routes/heroRoutes');
const AuthRoutes = require('./routes/authRoutes');
const UtilsRoutes = require('./routes/utilsRoutes');

const KEY = process.env.JWT_KEY;

const swaggerConfig = {
  info: {
    title: '#CursoNodeBR - API Herois',
    version: 'v1.0',
  },
  lang: 'pt',
};

const app = new Hapi.Server({
  port: process.env.PORT,
  routes: {
    cors: true,
  },
});

function mapRoutes(instance, methods) {
  return methods.map((method) => instance[method]());
}

async function main() {
  const connectionPostgres = await PostgresDB.connect();
  const model = await PostgresDB.defineModel(connectionPostgres, postgresModel);
  const postgresModel = new Context(new PostgresDB(connectionPostgres, model));

  const connectionMongoDB = MongoDB.connect();
  const context = new Context(
    new MongoDB(connectionMongoDB, mongoHeroesSchema)
  );

  await app.register([
    Inert,
    Vision,
    HapiJwt,
    {
      plugin: HapiSwagger,
      options: swaggerConfig,
    },
  ]);

  app.auth.strategy('jwt', 'jwt', {
    key: KEY,
    validate: (data, request) => {
      return {
        isValid: true,
      };
    },
  });

  app.auth.default('jwt');

  app.route([
    ...mapRoutes(new UtilRoutes(), UtilRoutes.methods()),
    ...mapRoutes(new HeroRoutes(context), HeroRoutes.methods()),
    ...mapRoutes(new AuthRoutes(JWT_KEY), AuthRoutes.methods()),
  ]);

  await app.start();

  console.log('Server runing at', app.info.port);

  return app;
}

module.exports = main();
