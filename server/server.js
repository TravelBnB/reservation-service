const newRelic = require('newrelic');
const compression = require('compression');
const express = require('express');
const path = require('path');
const db = require('../postgresdb/db.js');
const utils = require('./utils.js');
// var http = require('http');

// http.globalAgent.maxSockets = 25;

const PORT = process.env.PORT || 3003;

const app = express();

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen(PORT, () => console.log('Listening at port: ' + PORT));


app.get('/listings/:listingId', (req, res) => {

  db.getListingById(req.params, (err, result) => {
    if (err) {
      res.status(500).send({ err: `Server oopsie ${err}` });
    } else if (result.length === 0) {
      res.status(404).send('No such listing');
    } else {
      const { total_reviews, avg_rating } = result.rows[0];
      result.rows[0].reviews = { total_reviews, avg_rating };
      res.send(result.rows[0]);
    }
  });
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
