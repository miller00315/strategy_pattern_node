'use strict';

class BaseRoute {
  constructor(server, strategy) {
    this._server = server;
    this._strategy = strategy;
  }

  list() {
    this.server.route(this.strategy.list);
  }

  delete() {
    this.server.route(this.strategy.delete);
  }

  create() {
    this.server.route(this.strategy.create);
  }

  update() {
    this.server.route(this.strategy.update);
  }
}

module.exports = BaseRoute;
