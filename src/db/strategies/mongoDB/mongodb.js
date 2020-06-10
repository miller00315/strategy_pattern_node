const InterfaceCrud = require('./../interfaces/interfaceCrud');
const Mongoose = require('mongoose');

const STATUS = {
  0: 'Desconectado',
  1: 'Conectado',
  2: 'Conectando',
  3: 'Desconectando',
};

class MongoDb extends InterfaceCrud {
  constructor(connection, schema) {
    super();
    this._schema = schema;
    this._connection = connection;
  }

  create(item) {
    return this._schema.create(item);
  }

  read(item, skip = 0, limit = 10) {
    return this._schema.find(item).skip(skip).limit(limit);
  }

  update(id, item) {
    return this._schema.updateOne({ _id: id }, { $set: item });
  }

  delete(id) {
    return this._schema.deleteOne({ _id: id });
  }

  async isConnected() {
    const state = STATUS[this._connection.readyState];

    if (state === 'Conectado') return true;

    if (state !== 'Conectando') return state;

    await new Promise((resolve) => setTimeout(resolve, 1000));

    return STATUS[this._connection.readyState];
  }

  static connect() {
    Mongoose.connect(
      'mongodb://temp:temppassowrd@localhost:27017/heroes',
      {
        useNewUrlParser: true,
      },
      function (error) {
        if (error) {
          return false;
        }
      }
    );

    const connection = Mongoose.connection;

    connection.once('open', () => console.log('database started'));

    return connection;
  }
}

module.exports = MongoDb;
