const newRelic = require('newrelic');
// const compression = require('compression');
// const cluster = require('cluster');
const express = require('express');
const path = require('path');
const db = require('../postgresdb/db.js');
const redisHelper = require('./redisHelper');

// change Num sockets
// var http = require('http');
// var https = require('https');
// https.globalAgent.maxSockets = 25;
// http.globalAgent.maxSockets = 25;
// console.log(https.globalAgent.maxSockets)
// console.log(http.globalAgent.maxSockets)

// Redis
// const REDIS_URL = process.env.REDIS_URL;
// const client = redis.createClient(REDIS_URL);
const PORT = process.env.PORT || 3003;
const app = express();

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.listen(PORT, () => console.log('Listening at port: ' + PORT));

app.get('/loaderio-19f67bc0154ba6500a7780d2c3da7639', (req, res) => {
  res.send('loaderio-19f67bc0154ba6500a7780d2c3da7639');
});

app.get('/listings/:listingId', (req, res) => {
  const listingId = req.params.listingId;
  // const countKey = `lists:${listingId}:count`;
  const ratesKey = `lists:${listingId}:rates`;
  redisHelper.redisHash(res, req, ratesKey, (input, callback) => {
    db.getListingById(input, callback);
  });
  // db.getListingById(req.params, (err, result) => {
  //   if (err) {
  //     res.status(500).send({ err: 'Failed to post dates' });
  //   } else {
  //     console.log(result);
  //     res.status(200).send(result.rows[0]);
  //   }
  // });
});

app.get('/listings/:listingId/reservations', (req, res) => {
  // TODO: refactor using router
  const listingId = req.params.listingId;
  // const countKey = `reservations:lists:${listingId}:count`;
  const ratesKey = `reservations:lists:${listingId}:rates`;
  redisHelper.redisSet(res, req, ratesKey, (input, callback) => {
    db.getBookedDatesByListingId(input, callback);
  });
  // db.getBookedDatesByListingId(req.body, (err, result) => {
  //   if (err) {
  //     res.status(500).send({ err: 'Failed to post dates' });
  //     console.log(err);
  //   } else {
  //     res.status(200).send(result);
  //   }
  // });
});

app.get('/guests/:guestId/reservations', (req, res) => {
  // TODO: refactor using router
  const guestId = req.params.listingId;
  // const countKey = `reservations:guests:${guestId}:count`;
  const ratesKey = `reservations:guests:${guestId}:rates`;
  redisHelper.redisSet(res, req, ratesKey, (input, callback) => {
    db.getBookedDatesByGuestId(input, callback);
  });
});

app.get('/listings/:listingId/guests/:guestId/reservations', (req, res) => {
  // TODO: refactor using router
  const { listingId, guestId } = req.params;
  // const countKey = `reservations:lists:${listingId}:guests:${guestId}:count`;
  const ratesKey = `reservations:lists:${listingId}:guests:${guestId}:rates`;
  redisHelper.redisSet(res, req, ratesKey, (input, callback) => {
    db.getBookedDatesByListingGuestId(input, callback);
  });
  // db.getBookedDatesByListingGuestId(req.body, (err, result) => {
  //   if (err) {
  //     res.status(500).send({ err: 'Failed to post dates' });
  //     console.log(err);
  //   } else {
  //     res.status(200).send(result);
  //   }
  // });
});

app.post('/reservations', (req, res) => {
  // TODO: find more elegant implementation that ensures atomicity
  db.postNewBookedDates(req.body, (err, result) => {
    if (err) {
      res.status(500).send({ err: 'Failed to post dates' });
      console.log(err);
    } else {
      res.status(201).send(result);
    }
  });
});

app.delete('/listings/:listingId/reservations', (req, res) => {

});
