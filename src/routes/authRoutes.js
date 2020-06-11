const BaseRoute = require('./base/baseRoute');
const Joi = require('joi');
const Boom = require('boom');
const failAction = require('./../utils/failAction');
const Jwt = require('jsonwebtoken');

class AuthRoutes extends BaseRoute {
  constructor(key) {
    super();
    this.key = key;
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

          if (username.toLowerCase() !== 'periquito') {
            return Boom.unauthorized();
          }

          if (password.toLowerCase() !== 'tamandua') {
            return Boom.unauthorized();
          }

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
