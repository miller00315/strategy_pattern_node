const assert = require('assert');
const Mongodb = require('../src/db/strategies/mongodb');
const context = require('../src/db/strategies/base/contextStrategy');

let MOCK_HEROI_ID = '';

const context = new context(new Mongodb());

const MOCK_HEROI_CADASTRAR = {
  nome: 'Mullher Maravilha',
  poder: 'Laço',
};

const MOCK_HEROI_DEFAULT = {
  nome: `Miranha-${Date.now()}`,
  poder: 'Telha',
};

const MOCK_HEROI_ATUALIZAR = {
  nome: `Patolino-${Date.now()}`,
  poder: 'Prosa ruim',
};

describe('Mongo Suite de teste', function () {
  this.timeout(Infinity);

  beforeAll(async () => {
    await context.connect();
    await context.create(MOCK_HEROI_DEFAULT);
    const result = await context.create(MOCK_HEROI_ATUALIZAR);
    MOCK_HEROI_ID = result._ID;
  });

  it(
    ('Verificar conexão',
    async () => {
      const result = await context.isConnected();

      const expected = 'Conectado';

      assert.deepEqual(result, expected);
    })
  );

  it('Cadastrar', async () => {
    const { nome, poder } = await context.create(MOCK_HEROI_CADASTRAR);

    assert.deepEqual({ nome, poder }, MOCK_HEROI_CADASTRAR);
  });

  it('Listar', async () => {
    const [{ nome, poder }] = await context.read({
      nome: MOCK_HEROI_DEFAULT.nome,
    });

    assert.deepEqual({ nome, poder }, MOCK_HEROI_DEFAULT);
  });

  it('Atualizar', async () => {
    const result = await context.update(MOCK_HEROI_ID, {
      nome: 'Pernalonga',
    });

    assert.deepEqual(result.nModified, 1);
  });

  it('Delete', async () => {
    const result = await context.delete(MOCK_HEROI_ID);

    assert.deepEqual(result.n, 1);
  });
});
