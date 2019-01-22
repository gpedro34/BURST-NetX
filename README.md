# BURST-NetX
NetX is an API, that hopefully will have a frontend in the future for a Explorer of the BURST network...

# DONE:
<<<<<<< HEAD
- API calls flow:
  - POST:
    - peers / peersByPlatform / peersByVersion / peersByHeight (localhost:3000/peers/)
      ```
      {	"requestType": "peers",	"start": 1,	"howMany": 300} -> start = 1; howMany = 250
        or
      {	"requestType": "peers",	"start": 1,	"howMany": 200} -> start = 1; howMany = 200
        or
      {	"requestType": "peers"}                             -> start = 0; howMany = 100
        or
      {"requestType": "peersbyPlatform","platform": "brs"}
        or
      {"requestType": "peersbyVersion","version": "1.1.1"}
        or
      {"requestType": "peersbyHeight","platform": "brs"}
      ```
    - peerById / peerByAddress (localhost:3000/peer/)
      ```
        {"id": 1}
          or
        {"address": "123.123.123.123:8123"}
      ```
=======
1. GET:
  * all peers - paginated (max 250 records) (localhost:3000/peers/:start/:howmany)
2. POST:
* peersByPlatform / peersByVersion / peersByHeight (localhost:3000/peers/)
  - {"requestType": "peersByPlatform","platform": "brs"}
  - {"requestType": "peersByVersion","version": "1.1.1"}
  - {"requestType": "peersByHeight","platform": "brs"}
 
* peerById / peerByAddress (localhost:3000/peer/)
  - {"id": 1}
  - {"address": "123.123.123.123:8123"}
 

>>>>>>> 28c5a81304f8b9268466a2a645c32a500449f603
- Error handling and validated data
- Some Documentation

# TODO:
- Integrate MariaDB functionality
- Do frontend
- Unit Testing

# Sugestions
If you have a sugestion, do a commit to the SUGESTIONS.md file in this directory, I'll look into it...
