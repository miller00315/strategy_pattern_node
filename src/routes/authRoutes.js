const BaseRoute = require('./base/baseRoute');
const Joi = require('joi');
const Boom = require('boom');
const Jwt = require('jsonwebtoken');
const PasswordHelper = require('./../helpers/passwordHelper');

class AuthRoutes extends BaseRoute {
  constructor(key, db) {
    super();
    this.key = key;
    this.db = db;
  }

  login() {
    return {
      path: '/login',
      method: 'POST',
      config: {
        auth: false,
        tags: ['api'],
        description: 'Obter token',
        notes: 'Faz login com user e senha',
        validate: {
          failAction,
          payload: {
            username: Joi.string().required(),
            password: Joi.string().required(),
          },
        },
        handler: async (request, headers) => {
          const { username, password } = request.payload;

          const [user] = await this.db.read({
            username: username.toLowerCase(),
          });

          if (!user) return Boom.unauthorized('Usário informado não existe');

          const match = await PasswordHelper.comparePassword(
            password,
            user.password
          );

          if (!match) return Boom.unauthorized('Senha inválida');

          const token = Jwt.sign(
            {
              username,
              id: 1,
            },
            this.key
          );

          return { token };
        },
      },
    };
  }
}

module.exports = AuthRoutes;
