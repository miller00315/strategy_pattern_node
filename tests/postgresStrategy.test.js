const assert = require('assert');
const heroiSchema = require('../src/db/strategies/postgres/schemas/heroesSchema');
const Postgres = require('../src/db/strategies/postgres/postgres');
const Context = require('../src/db/strategies/base/contextStrategy');

const MOCK_HEROE_CADASTRAR = { nome: 'Gavião arqueiro', poder: 'Mira' };

const MOCK_HEROE_ATUALIZAR = { nome: 'Batman', poder: 'Dinheiro' };

let context = {};

describe('Postgres Strategy', function () {
  this.timeout(Infinity);

  this.beforeAll(async () => {
    const connection = await Postgres.connect();
    const model = await Postgres.defineModel(connection, heroiSchema);
    context = new Context(new Postgres(connection, model));
    await context.delete();
    await context.create(MOCK_HEROE_ATUALIZAR);
  });

  it('Postgres sql', async () => {
    const result = await context.isConnected();
    assert.equal(result, true);
  });

  it('Cadastrar', async () => {
    const result = await context.create(MOCK_HEROE_CADASTRAR);
    delete result.id;
    assert.deepEqual(result, MOCK_HEROE_CADASTRAR);
  });

  it('Listar', async () => {
    // Linha baixo é identico a fazer const [po1, pos2] = ['Esse é o 1', 'Esse é o 2']
    const [result] = await context.read({ nome: MOCK_HEROE_CADASTRAR.nome });
    delete result.id;
    assert.deepEqual(result, MOCK_HEROE_CADASTRAR);
  });

  it('Atualizar', async () => {
    // Linha baixo é identico a fazer const [po1, pos2] = ['Esse é o 1', 'Esse é o 2']
    const [itemAtualizar] = await context.read({
      nome: MOCK_HEROE_ATUALIZAR.nome,
    });

    const newItem = {
      ...MOCK_HEROE_ATUALIZAR,
      nome: 'Demolidor',
    };

    const [result] = await context.update(itemAtualizar.id, newItem);

    assert.deepEqual(result, 1);

    const [itemAtualizado] = await context.read({
      id: newItem.id,
    });

    assert.deepEqual(itemAtualizado.nome, newItem.nome);
  });

  it('Delete por id', async () => {
    // Linha baixo é identico a fazer const [po1, pos2] = ['Esse é o 1', 'Esse é o 2']
    const [item] = await context.read({});

    const result = await context.delet(item.id);

    assert.deepEqual(result, 1);
  });
});
