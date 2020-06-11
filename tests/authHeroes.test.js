const assert = require('assert');
const api = require('./../src/api');

let app = {};

describe('Auth test Suite', function () {
  this.beforeAll(async () => {
    const app = await api;
  });

  it('Deve obter um token', async () => {
    const result = await app.inject({
      method: 'POST',
      url: '/login',
      payload: {
        username: 'dummy',
        password: 'dummy',
      },
    });

    const { statusCode } = result;
    const data = JSON.parse(result.payload);
  });
});
