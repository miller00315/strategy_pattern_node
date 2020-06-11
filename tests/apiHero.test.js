const assert = require('assert');
const app = require('./../src/api');

const MOCK_HEROI_CADASTRAR = {
  nome: 'Chapolin',
  poder: 'Marreta',
};

describe('Mongo Suite de teste', function () {
  it('lista GET - /heroes - deve filtrar um item', async () => {});

  it('cadastrar POST - /heroes', async () => {
    const result = await app.inject({
      method: 'POST',
      url: '/heroes',
      payload: MOCK_HEROI_CADASTRAR,
    });
    const { statusCode } = result;
  });

  it('remover DLET = /herois/:id', async () => {
    const _id = MOCK_HEROI_CADASTRAR.id;
    const result = await app.inject({
      method: 'DELETE',
      url: `/heroes/${id}`,
    });
  });
});
