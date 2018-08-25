DELETE FROM users WHERE id >= 5000001;
DELETE FROM hosts WHERE id >= 100001;
DELETE FROM listings WHERE id >= 10000001;
DELETE FROM reservations WHERE id >= 47884335;

ALTER SEQUENCE users_id_seq RESTART WITH 5000001;
ALTER SEQUENCE hosts_id_seq RESTART WITH 100001;
ALTER SEQUENCE listings_id_seq RESTART WITH 10000001;
ALTER SEQUENCE reservations_id_seq RESTART WITH 47884335;

CREATE INDEX host_id_index ON listings (host_id);
CREATE INDEX listing_id_index ON reservations (listing_id);
CREATE INDEX guest_id_index ON reservations (guest_id);
DROP INDEX listing_id_index;
DROP INDEX guest_id_index;
DROP INDEX guest_id2_index;
CREATE INDEX join_id_index ON reservations (listing_id, guest_id);

\copy users FROM 'D:\dataSet\users.csv' DELIMITER ',' CSV HEADER;
\copy hosts FROM 'C:\Users\shane\Desktop\HackReactor\TravelBnB\test\dataSet\hosts.csv' DELIMITER ',' CSV HEADER;
\copy listings FROM 'C:\Users\shane\Desktop\HackReactor\TravelBnB\test\dataSet\catListings.csv' DELIMITER ',' CSV HEADER;
\copy reservations FROM 'C:\Users\shane\Desktop\HackReactor\TravelBnB\test\dataSet\reservations.csv' DELIMITER ',' CSV HEADER;
