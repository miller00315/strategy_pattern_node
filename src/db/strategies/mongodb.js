const InterfaceCrud = require('./interfaces/interfaceCrud');
const Mongoose = require('mongoose');

const STATUS = {
  0: 'Desconectado',
  1: 'Conectado',
  2: 'Conectando',
  3: 'Desconectando',
};

class MongoDb extends InterfaceCrud {
  constructor() {
    super();
    this._heroes = null;
    this._drive = null;
  }

  create(item) {
    return this._heroes.create(item);
  }

  read(item, skip = 0, limit = 10) {
    return this._heroes.find(item).skip(skip).limit(limit);
  }

  update(id, item) {
    return this._heroes.updateOne({ _id: id }, { $set: item });
  }

  delete(id) {
    return this._heroes.deleteOne({ _id: id });
  }

  async isConnected() {
    const state = STATUS[this._driver.readyState];

    if (state === 'Conectado') return true;

    if (state !== 'Conectando') return state;

    await new Promise((resolve) => setTimeout(resolve, 1000));

    return STATUS[this._driver.readyState];
  }

  connect() {
    Mongoose.connect(
      'mongodb://user:userPassword@localhost:27017/heroes',
      {
        useNewUrlParser: true,
      },
      function (error) {
        if (error) {
          return false;
        }
      }
    );

    this._driver = Mongoose.connection;

    this._driver.once('open', () => console.log('database started'));

    this.defineModel();
  }

  async defineModel() {
    const heroSchema = new Mongoose.Schema({
      nome: {
        type: String,
        required: true,
      },
      poder: {
        type: String,
        required: true,
      },
      insertedAt: {
        type: Date,
        default: new Date(),
      },
    });

    this._heroes = Mongoose.model('heroes', heroSchema);
  }
}

module.exports = MongoDb;
