const cache = require('../../singleton').cache;


module.exports = (method, ttl = undefined) => async (...args) => {
  const key = `${method.name}:${args.join(':')}`;
  let info = cache.get(key);
  if (!info) {
    info = await method(...args);
    cache.set(key, info, ttl);
  }
  return info;
};
