# BURST-NetX
NetX is an API, that hopefully will have a frontend in the future for a Explorer of the BURST network...

# DONE:
- API calls flow:
1. POST:
* peers / peersByPlatform / peersByVersion / peersByHeight (localhost:3000/peers/)
  - {	"requestType": "peers",	"start": 1,	"howMany": 300} -> start = 1; howMany = 250
  - {	"requestType": "peers",	"start": 1,	"howMany": 200} -> start = 1; howMany = 200
  - {	"requestType": "peers"}                             -> start = 0; howMany = 100
  - {"requestType": "peersbyPlatform","platform": "brs"}
  - {"requestType": "peersbyVersion","version": "1.1.1"}
  - {"requestType": "peersbyHeight","platform": "brs"}
* peerById / peerByAddress (localhost:3000/peer/)
  - {"id": 1}
  - {"address": "123.123.123.123:8123"}
2. POST:
* peersByPlatform / peersByVersion / peersByHeight (localhost:3000/peers/)
  - {"requestType": "peersByPlatform","platform": "brs"}
  - {"requestType": "peersByVersion","version": "1.1.1"}
  - {"requestType": "peersByHeight","platform": "brs"}

* peerById / peerByAddress (localhost:3000/peer/)
  - {"id": 1}
  - {"address": "123.123.123.123:8123"}


# TODO:
- Integrate MariaDB functionality
- Do frontend
- Unit Testing

# Sugestions
If you have a sugestion, do a commit to the SUGESTIONS.md file in this directory, I'll look into it...
