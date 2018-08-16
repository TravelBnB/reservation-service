const newRelic = require('newrelic');
const express = require('express');
const path = require('path');
const db = require('../postgresdb/db.js');
const utils = require('./utils.js');
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


app.post('/listings/:listingId/reservations', (req, res) => {
  // TODO: find more elegant implementation that ensures atomicity
  const data = utils.parseBookedDates(req.body);
  db.postNewBookedDates(data, (err, result) => {
    if (err) {
      res.status(500).send({ err: 'Failed to post dates' });
    } else {
      data.bookedDatesId = result.insertId;
      db.postNewReservation(data, (error, reservation) => {
        if (err) {
          db.deleteBookedDatesById(result.insertId, () => {
            res.status(500).send({ err: 'Failed to post reservation' });
          });
        } else res.status(201).send(reservation);
      });
    }
  });
});

app.delete('/listings/:listingId/reservations', (req, res) => {

});
