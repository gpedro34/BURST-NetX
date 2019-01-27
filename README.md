# BURST-NetX (Beta-stage)
NetX is an API, that hopefully will have a frontend in the near future for a Explorer of the BURST network...

# REQUIREMENTS
- [mysql shell](https://dev.mysql.com/downloads/windows/installer/8.0.html) installed and added to [system path](https://www.computerhope.com/issues/ch000549.htm) as 'mysql' (tested with v8.0.14)
- NodeJS (tested with v11.6.0)
- MariaDB (tested with v10.1.29)

# LAUNCH
- Create DB 'brs_crawler':
  - Run SQL:
```
CREATE SCHEMA `brs_crawler` DEFAULT CHARACTER SET utf8mb4 ;
```
- create user 'NetX' and grant all privileges on db 'brs_crawler':
  - Run SQL:
```
CREATE USER 'netX'@'localhost' IDENTIFIED BY 'netX';
GRANT ALL PRIVILEGES ON brs_crawler.* TO 'netX'@'localhost';
```
- [Download bootstrap file](https://drive.google.com/open?id=1xMMO0rq5mDuvj8Y1lHHzXG8RivPzfqEs) for provisional db from
- Run on terminal (in the folder where you have brs_crawler.sql file downloaded from link above):
```
mysql brs_crawler -u netX -pnetX < brs_crawler.sql
```
- Launch this repository with NodeJS:
  - Run on terminal:
```
npm run setup
npm start
```

- Import Postman examples into Postman and test the API calls
- Please report issues in the issues tab and if you are keen to it, contributions are appreciated.

# DONE:
- IP Location, Public wallet verification and SSL Checking (just for peerById or peerByAddress)
- API calls:
* peers (POST localhost:5000/peers/)
  - {	"requestType": "peers",	"start": 10,	"howMany": 30}  -> start = 10; howMany = 25
  - {	"requestType": "peers",	"howMany": 20}                -> start = 1; howMany = 20
  - {	"requestType": "peers"}                               -> start = 1; howMany = 25
* peer (by ID or Address) (POST localhost:5000/peer/)
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

# CONTRIBUTING
PRs are appreciated but if you want to contribute with some BURST feel free to send it to BURST-R8SJ-V2FS-QF4V-DFMA9 or by using alias @NetX on BURST network...
