const Quin = require('@coderich/quin');

module.exports = class MongoResolver extends Quin {
  #idKey;
  #mongoClient;

  constructor(config) {
    const { mongoClient, ...quinConfig } = config;
    super(quinConfig);
    this.#mongoClient = mongoClient;
  }

  resolve() {
    const query = super.resolve();
    return this[query.op](query);
  }

  findOne(query) {
    return this.#mongoClient.collection(query.model).findOne(query.where);
  }

  findMany(query) {
    return this.#mongoClient.collection(query.model).find(query.where);
  }
};
