const InterfaceCrud = require('./interfaces/interfaceCrud');
const Sequelize = require('sequelize');

class Postgres extends InterfaceCrud {
  constructor() {
    super();
    this.driver = null;
    this._heroes = null;
    this._connect();
  }

  async create(item) {
    const { dataValues } = await this._heroes.create(item);

    return dataValues;
  }

  async update(id, item) {
    return await this._heroes.update(item, {
      where: {
        id,
      },
    });
  }

  async read(item = {}) {
    const result = await this._heroes.findAll({
      where: item,
      raw: true,
    });

    return result;
  }

  async delete(id) {
    const query = id ? { id } : {};
    const result = await this._heroes.destroy({
      where: query,
    });
  }

  async isConnected() {
    try {
      await this._driver.authenticate();
      return true;
    } catch (err) {
      console.log('fail, err');
      return false;
    }
  }

  async connect() {
    this._driver = new Sequelize('heroes', 'test', 'test', {
      host: 'localhost',
      dialect: 'postgres',
      quoteIdentifiers: false,
      operatorsAliases: false,
    });

    await this.defineModel();
  }

  async defineModel() {
    this._heroes = this._driver.define(
      'heroes',
      {
        id: {
          type: Sequelize.INTEGER,
          required: true,
          primaryKey: true,
          autoIncrement: true,
        },
        nome: {
          type: Sequelize.STRING,
          required: true,
        },
        poder: {
          type: Sequelize.STRING,
          required: true,
        },
      },
      {
        tableName: 'TB_HEROES',
        freezeTableName: false,
        timestamps: false,
      }
    );

    await this._heroes.sync();
  }
}

module.exports = Postgres;
