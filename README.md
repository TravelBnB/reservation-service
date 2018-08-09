# Reservation Service for Airpnp

> Booking module allows user to see general listing details, vacancies in a month, and make a reservation by choosing check-in/check-out dates on a calendar, and specify number of guests.

## Related Projects

  - https://github.com/fullstakreaktor/hero-photo-service
  - https://github.com/fullstakreaktor/Review-service
  - https://github.com/fullstakreaktor/about-service
  - https://github.com/fullstakreaktor/kony-proxy

#CRUD API Endpoints

- GET /listings/:listingId/

- GET /listings/:listingId/reservations 

- POST /listings/:listingId/reservations {user_id: INT NOT NULL, content: text}

- UPDATE /listings/:listingId/reservations {user_id: INT NOT NULL, content: text}

- DELETE /listings/:listingId/reservations {user_id: INT NOT NULL, content: text}