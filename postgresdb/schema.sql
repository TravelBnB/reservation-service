CREATE TABLE IF NOT EXISTS users (
  id serial,
  name varchar(30),
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS hosts (
  id serial,
  user_id INT references users(id),
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS listings (
  id serial,
  name varchar(80),
  host_id INT references hosts(id),
  rate INT NOT NULL,
  fees INT DEFAULT 0,
  tax_rate FLOAT,
  weekly_views INT DEFAULT 0,
  min_stay INT DEFAULT 1,
  max_guests INT,
  total_reviews INT DEFAULT 0,
  avg_rating FLOAT DEFAULT 0,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS reservations (
  id serial,
  listing_id INT references listings(id),
  guest_id INT references users(id),
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  total_charge INT NOT NULL, 
  total_pups INT DEFAULT 0,
  total_adults INT NOT NULL,
  created_at DATE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE INDEX host_id_index ON listings (host_id);
CREATE INDEX listing_id_index ON reservations (listing_id);
CREATE INDEX guest_id_index ON reservations (guest_id);

ALTER SEQUENCE users_id_seq RESTART WITH 5000001;
ALTER SEQUENCE hosts_id_seq RESTART WITH 100001;
ALTER SEQUENCE listings_id_seq RESTART WITH 10000001;
ALTER SEQUENCE reservations_id_seq RESTART WITH 47884335;