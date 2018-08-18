const newRelic = require('newrelic');
const compression = require('compression');
const express = require('express');
const redis = require('redis');
const path = require('path');
const db = require('../postgresdb/db.js');
const utils = require('./utils.js');
const axios = require('axios');

const API_URL = 'http://api.fixer.io';

// change Num sockets
// var http = require('http');
// http.globalAgent.maxSockets = 25;

// Redis
const REDIS_URL = process.env.REDIS_URL;
const client = redis.createClient(REDIS_URL);

const PORT = process.env.PORT || 3003;

const app = express();

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen(PORT, () => console.log('Listening at port: ' + PORT));


app.get('/listings/:listingId', (req, res) => {
  const listingId = req.params.listingId;
  const countKey = `${listingId}:count`;
  const ratesKey = `${listingId}:rates`;
  const url = `${API_URL}/${listingId}`;

  client.incr(countKey, (err, count) => {
    client.hgetall(ratesKey, (err, rates) => {
      if (rates) {
        return res.send(rates);
      }
      db.getListingById(req.params, (err, result) => {
        if (err) {
          res.status(500).send({ err: `Server oopsie ${err}` });
        } else if (result.length === 0) {
          res.status(404).send('No such listing');
        } else {
          const { total_reviews, avg_rating } = result.rows[0];
          result.rows[0].reviews = { total_reviews, avg_rating };
          client.hmset(
            ratesKey, result.rows[0], (err, result) => {
              if (err) console.log(err);
            },
          );
          return res.send({ 
            count,
            rates: result.rows[0],
          });
        }
      });
    });
  });
  // db.getListingById(req.params, (err, result) => {
  //   if (err) {
  //     res.status(500).send({ err: `Server oopsie ${err}` });
  //   } else if (result.length === 0) {
  //     res.status(404).send('No such listing');
  //   } else {
  //     const { total_reviews, avg_rating } = result.rows[0];
  //     result.rows[0].reviews = { total_reviews, avg_rating };
  //     // res.json({ rates: res.data.rates });
  //     console.log(result.rows[0]);
  //     res.send(result.rows[0]);
  //   }
  // });
});

app.get('/listings/:listingId/reservations', (req, res) => {
  // TODO: refactor using router
  const data = req.params.listingId;
  db.getBookedDatesByListingId(data, (err, result) => {
    if (err) {
      res.status(500).send({ err: `Server oopsie ${err}` });
    } else {
      res.send(result.rows);
    }
  });
});

app.get('/guests/:guestId/reservations', (req, res) => {
  // TODO: refactor using router
  const data = req.params.guestId;
  db.getBookedDatesByGuestId(data, (err, result) => {
    if (err) {
      res.status(500).send({ err: `Server oopsie ${err}` });
    } else {
      res.send(result.rows);
    }
  });
});

app.get('/listings/:listingId/guests/:guestId/reservations', (req, res) => {
  // TODO: refactor using router
  const { listingId, guestId } = req.params;
  db.getBookedDatesByListingGuestId(listingId, guestId, (err, result) => {
    if (err) {
      res.status(500).send({ err: `Server oopsie ${err}` });
    } else {
      res.send(result.rows);
    }
  });
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
