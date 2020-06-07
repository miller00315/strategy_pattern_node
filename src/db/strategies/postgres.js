const InterfaceCrud = require('./interfaces/interfaceCrud');

class Postgres extends InterfaceCrud {
  constructor() {
    super();
  }

  create(item) {
    console.log('O item foi salvo Postgres');
  }
}

module.exports = Postgres;
