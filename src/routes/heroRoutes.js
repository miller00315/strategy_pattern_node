const BaseRoute = require('./base/baseRoute');
const Joi = require('joi');
const Boom = require('boom');

const failAction = (request, headers, erro) => {
    throw erro;
};

class HeroRoutes extends BaseRoute {
  constructor(db) {
    super();
    this.db = db;
  }

  // Criar novo heroi POST
  create() {
    return {
        path: '/heroes',
        method: 'POST',
        config: {
            tags: ['api'],
            description: 'Deve criar heoroes',
            notes: 'Deve criar hero com moe e poder',
            validate: {
                failAction,
                payload: {
                    nome: Joi.string().required().min(3).max(100),
                    poder: Joi.string().required().min(2).max(100),
                }
            }
        },
        handler: (request) => {
            try {
                const {nome, poder} = request.payload;

                const result = await this.db.create({nome, poder});

                return {
                    message: 'heroi cadastrado',
                    _id: result,
                }
            } catch (error) {
                return Boom.internal();
            }
        }
    }
  }

  // Delete os números
  delete() {
    return {
        path: '/heroes',
        method: 'DELETE',
        config: {
            tags: ['api'],
            description: 'Deve excluir heoroes',
            notes: 'Pode excluir o heroi através do id',
            validate: {
                failAction,
                params: {
                    id: Joi.string().required(),
                }
            }
        },
        handler: async (request) => {
            try{
                const {id} = request.params;
                const result = await this.db.delete(id);

                if(result.n !== 1) return Boom.preconditionFailed('Id não encontrado no banco');
                
                return {message: 'Item removido'}

            }catch(err){
                return Boom.internal();
            }
        }
    }
  }

  // Listar itens do banco de dados
  list() {
    return {
      path: '/heroes',
      method: 'GET',
      config: {
        tags: ['api'],
        description: 'Deve listar heoroes',
        notes: 'Pode paginar resultados e filtrar po nome',
        validate: {
            failAction,
            query: {
                skip: Joi.number().integer().default(0),
                limit: Joi.number().integer().default(10),
                nome: Joi.string().min().max(100),
            }
        }
      },
      handler: (request, headers) => {
        try {
        const { skip, limit, nome } = request.query;

         const query = nome ? {nome: {$regex: `.*${nome}*.`}} : {};

          return await this.db.read(nome ? query : {}, skip, limit);
        } catch (err) {
          return Boom.internal();
        }
      },
    };
  }

  update() {
      return {
          path: '/heroes/{id}',
          method: 'PATCH',
          config: {
            tags: ['api'],
            description: 'Deve atualizar heoroes',
            notes: 'Pode atualizar qualquer campo',
            validate: {
                params: {
                    id: Joi.string().required(),
                },
                payload: {
                    name: Joi.string().min(3).max(100),
                    poder: Joi.string().min(2).max(100),
                }
            }
          },
          handler: (request, headers) => {
            try {

                const { payload, params } = request;

                return await this.db.update(params.id, payload);

            } catch (err) {
                return Boom.internal();
            }
          }
      }
  }
}

module.exports = HeroRoutes;
