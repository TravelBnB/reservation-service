const { Pool } = require('pg');

const client = new Pool({
  user: 'postgres',
  // host: 'database.server.com',
  database: 'reservations',
  // password: '1234',
  // port: 5432,
});

client.connect();

const getListingById = ({listingId}, callback) => {
  const queryStr = `SELECT * from listings WHERE id = $1 ;`;
  client.query(queryStr, [listingId], callback);
};

const getBookedDatesByListingId = (listingId, callback) => {
  // let startDate = [year, month, 1].join('-');
  // let endDate = month === 12? [Number(year)+1, 1, 1].join('-'): [year, Number(month)+1, 1].join('-');
  const queryStr = `SELECT check_in, check_out FROM reservations WHERE listing_id = $1 ;`;
  // console.log(listingId, startDate, endDate);
  client.query(queryStr, [listingId], callback);
};
const getBookedDatesByGuestId = (guestId, callback) => {
  // let startDate = [year, month, 1].join('-');
  // let endDate = month === 12? [Number(year)+1, 1, 1].join('-'): [year, Number(month)+1, 1].join('-');
  const queryStr = `SELECT check_in, check_out FROM reservations WHERE guest_id = $1 ;`;
  // console.log(listingId, startDate, endDate);
  client.query(queryStr, [guestId], callback);
};

const getBookedDatesByListingGuestId = (listingId, guestId, callback) => {
  // let startDate = [year, month, 1].join('-');
  // let endDate = month === 12? [Number(year)+1, 1, 1].join('-'): [year, Number(month)+1, 1].join('-');
  const queryStr = `SELECT check_in, check_out FROM reservations WHERE listing_id = $1 AND guest_id = $2 ;`;
  // console.log(listingId, startDate, endDate);
  client.query(queryStr, [listingId, guestId], callback);
};

module.exports = {
  getListingById,
  getBookedDatesByListingId,
  getBookedDatesByGuestId,
  getBookedDatesByListingGuestId,
};
