const redis = require('redis');

const REDIS_URL = process.env.REDIS_URL;
const client = redis.createClient(REDIS_URL);

const redisHash = (res, req, ratesKey, callback) => {
  // client.incr(countKey, (err, count) => {
  client.hgetall(ratesKey, (err, rates) => {
    if (rates) {
      return res.send(rates);
    }
    callback(req.params, (err, result) => {
      if (err) {
        res.status(500).send({ err: `Server oopsie ${err}` });
      } else if (result.rows.length === 0) {
        res.status(404).send('No such listing');
      } else {
        client.hmset(
          ratesKey, result.rows[0], (err, result) => {
            if (err) console.log(err);
          },
        );
        return res.send(result.rows[0]);
      }
    });
  });
  // });
};

const redisSet = (res, req, ratesKey, callback) => {
// client.incr(countKey, (err, count) => {
  client.get(ratesKey, (err, rates) => {
    if (rates) {
      return res.send(JSON.parse(rates));
    }
    callback(req.params, (err, result) => {
      if (err) {
        res.status(500).send({ err: `Server oopsie ${err}` });
      } else if (result.rows.length === 0) {
        res.status(404).send('No such listing');
      } else {
        client.set(
          ratesKey, JSON.stringify(result.rows), (err, result) => {
            if (err) console.log(err);
          },
        );
        return res.send(result.rows);
      }
    });
  });
// });
};

module.exports = {
  redisHash,
  redisSet,
};
