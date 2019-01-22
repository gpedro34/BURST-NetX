# BURST-NetX
NetX is an API, that hopefully will have a frontend in the future for a Explorer of the BURST network...

# DONE:
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
 

- Error handling and validated data
- Some Documentation

# TODO:
- Integrate MariaDB functionality
- Do frontend
- Unit Testing

# Sugestions
If you have a sugestion, do a commit to the SUGESTIONS.md file in this directory, I'll look into it...
