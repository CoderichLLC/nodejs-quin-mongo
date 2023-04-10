/* eslint-disable no-underscore-dangle */

const Path = require('path');
const { parseFixtures } = require('@coderich/dev');
const MongoClient = require('../src/MongoClient');
const MongoResolver = require('../src/MongoResolver');

describe('MongoResolver', () => {
  let mongoClient, fixtures;

  const factory = args => new MongoResolver({ mongoClient, model: 'classrooms', keyMap: { id: '_id' }, ...args });

  beforeAll(() => {
    mongoClient = new MongoClient({ uri: 'mongodb://127.0.0.1:27000/jest' });
    fixtures = parseFixtures(Path.join(__dirname, '..', '__fixtures__'));
    return Promise.all(Object.entries(fixtures).map(([key, value]) => mongoClient.collection(key).insertMany([value].flat())));
  });

  afterAll(() => {
    return mongoClient.disconnect();
  });

  test('Basic queries', async () => {
    const { classrooms } = fixtures;
    expect(await factory().one()).toEqual(classrooms[0]);
    expect(await factory().id('nothing').one()).toBeNull();
    expect(await factory().id(undefined).one()).toBeNull();
    expect(await factory().id(classrooms[1]._id).one()).toEqual(classrooms[1]);
    expect(await factory().where({ id: classrooms[1]._id }).one()).toEqual(classrooms[1]);
    expect(await factory().where({ name: classrooms[1].name }).one()).toEqual(classrooms[1]);
    expect(await factory().many().then(c => c.toArray())).toEqual(classrooms);
  });
});
