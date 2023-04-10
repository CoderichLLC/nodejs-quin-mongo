const { MongoClient } = require('mongodb');

module.exports = class MongClient {
  constructor(config = {}) {
    const { uri } = config;
    const options = { useNewUrlParser: true, useUnifiedTopology: true, ignoreUndefined: false };
    this.mongoClient = new MongoClient(uri, options);
    this.connection = this.mongoClient.connect();
  }

  disconnect() {
    return this.connection.then(client => client.close());
  }

  collection(name) {
    return new Proxy(this, {
      get(target, method) {
        return (...args) => target.connection.then(client => client.db().collection(name)[method](...args));
      },
    });
  }
};
