const InterfaceCrud = require('./../interfaces/interfaceCrud');
const Sequelize = require('sequelize');

class Postgres extends InterfaceCrud {
  constructor(connection, schema) {
    super();
    this._connection = connection;
    this._schema = schema;
  }

  async create(item) {
    const { dataValues } = await this._schema.create(item);

    return dataValues;
  }

  async update(id, item) {
    return await this._schema.update(item, {
      where: {
        id,
      },
    });
  }

  async read(item = {}) {
    const result = await this._schema.findAll({
      where: item,
      raw: true,
    });

    return result;
  }

  async delete(id) {
    const query = id ? { id } : {};
    const result = await this._schema.destroy({
      where: query,
    });

    return result;
  }

  async isConnected() {
    try {
      await this._connection.authenticate();
      return true;
    } catch (err) {
      console.log('fail, err');
      return false;
    }
  }

  static async connect() {
    // Sequelize precisa de banco, usuário e senha
    const connection = new Sequelize('heroes', 'test', 'test', {
      host: 'localhost',
      dialect: 'postgres',
      quoteIdentifiers: false,
      operatorsAliases: false,
      logging: false,
    });

    return connection;
  }

  static async defineModel(connection, schema) {
    const model = connection.define(schema.name, schema.schema, schema.options);

    await model.sync();

    return model;
  }
}

module.exports = Postgres;
