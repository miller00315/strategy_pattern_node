const InterfaceCrud = require('./interfaces/interfaceCrud');

class MongoDb extends InterfaceCrud {
  constructor() {
    super();
  }

  create(item) {
    console.log('O item foi salvo mongo db');
  }
}

module.exports = MongoDb;
