# BURST-NetX
NetX is an API, that hopefully will have a frontend in the near future for a Explorer of the BURST network...

# LAUNCH
- Download a provisional DB for tests from https://drive.google.com/open?id=1dfObeGfOX_RmalNaGE77k9ZWnOdOuNZJ
- Put that DB folder into your path_to_MariaDB/data/
- create user 'NetX' and grant all privileges on db 'brs_crawler':
  - Run SQL:
```
CREATE USER 'netX'@'localhost' IDENTIFIED BY 'netX';
GRANT ALL PRIVILEGES ON brs_crawler.* TO 'netX'@'localhost';
```
- Launch this repo with NodeJS:
  - Run on terminal:
```
node server.js
```
- Import Postman examples into Postman and test the API calls

# DONE:
- IP Location, Public wallet verification and SSL Checking (just for peerById or peerByAddress)
- API calls flow:
1. POST:
* peers (localhost:3000/peers/)
  - {	"requestType": "peers",	"start": 10,	"howMany": 30}  -> start = 10; howMany = 25
  - {	"requestType": "peers",	"howMany": 20}                -> start = 1; howMany = 20
  - {	"requestType": "peers"}                               -> start = 1; howMany = 25
* peer (by ID or Address) (localhost:3000/peer/)
  - {"id": 1}                                               -> search by ID
  - {"address": "123.123.123.123:8123"}                     -> search by Address
  - {"id": 1, "address": "123.123.123.123:8123"}            -> search by ID

# TODO:
- Integrate POST calls:
  - {"requestType": "peersbyPlatform","platform": "brs"}
  - {"requestType": "peersbyVersion","version": "1.1.1"}
  - {"requestType": "peersbyHeight","height": 500000}
- Frontend
- Unit Testing

# SUGESTIONS
If you have a feature request, do a commit to the SUGESTIONS.md file in this directory.

# NOTES
- SSL check only checks for time validity of certificate (needs a disclaimer on the site with a link for a deeper analisys like https://globalsign.ssllabs.com/analyze.html?d=wallet.burst.cryptoguru.org)
