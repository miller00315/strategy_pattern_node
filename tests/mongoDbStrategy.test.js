const assert = require('assert');
const Mongodb = require('../src/db/strategies/mongodb');
const context = require('../src/db/strategies/base/contextStrategy');

const context = new context(new Mongodb());

describe('Mongo Strategy', function () {
  this.timeout(Infinity);

  if (
    ('MongDB',
    async () => {
      const result = await context.isConnected();

      assert.equal(result, true);
    })
  );
});
