# BURST-NetX
NetX is an API, that hopefully will have a frontend in the future for a Explorer of the BURST network...

# DONE:
- IP Location, Public wallet verification and SSL Checking (just for peerById or peerByAddress)
- API calls flow:
1. POST:
* peers / peersByPlatform / peersByVersion / peersByHeight (localhost:3000/peers/)
  - {	"requestType": "peers",	"start": 1,	"howMany": 30}  -> start = 1; howMany = 25
  - {	"requestType": "peers",	"howMany": 20}              -> start = 1; howMany = 20
  - {	"requestType": "peers"}                             -> start = 1; howMany = 25
* peerById / peerByAddress (localhost:3000/peer/)
  - {"id": 1}
  - {"address": "123.123.123.123:8123"}

# TODO:
- Integrate POST calls:
  - {"requestType": "peersbyPlatform","platform": "brs"}
  - {"requestType": "peersbyVersion","version": "1.1.1"}
  - {"requestType": "peersbyHeight","height": 500000}
- Frontend
- Unit Testing

# Sugestions
If you have a sugestion, do a commit to the SUGESTIONS.md file in this directory, I'll look into it...

# NOTES
- SSL check only checks for time validity of certificate (needs a disclaimer on the site with a link for a deeper analisys like https://globalsign.ssllabs.com/analyze.html?d=wallet.burst.cryptoguru.org)
