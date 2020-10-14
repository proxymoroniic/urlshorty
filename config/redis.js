const mongoose = require('mongoose');
const redis = require('redis');
const db = config.get('redisURI');

const client = redis.createClient(keys.REDIS_URL);
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function(options = { expire: 3600 }) {
    this.useCache = true;
    this.expire = options.expire;
    this.hashKey = JSON.stringify(options.key || this.mongooseCollection.name);
  
    return this;
  }

  mongoose.Query.prototype.exec = async function() {
    if (!this.useCache) {
      return await exec.apply(this, arguments);
    }
  
    const key = JSON.stringify({
      ...this.getQuery(),
      collection: this.mongooseCollection.name
    });

    const cacheValue = await client.hget(this.hashKey, key);

    // if cache value is not found, fetch data from mongodb and cache it
    if (!cacheValue) {
      const result = await exec.apply(this, arguments);
      client.hset(this.hashKey, key, JSON.stringify(result));
      client.expire(this.hashKey, this.expire);
  
      console.log('Return data from MongoDB');
      return result;
    }
  
    // return found cachedValue
    const doc = JSON.parse(cacheValue);
    console.log('Return data from Redis');
    return Array.isArray(doc)
      ? doc.map(d => new this.model(d))
      : new this.model(doc);
  };
  
  module.exports = {
    clearHash(hashKey) {
      client.del(JSON.stringify(hashKey));
    }
  }