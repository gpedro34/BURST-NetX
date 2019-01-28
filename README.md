# BURST-NetX (Beta-stage)
NetX is an API, that hopefully will have a frontend in the near future for a Explorer of the BURST network...

# REQUIREMENTS
- [mysql shell](https://dev.mysql.com/downloads/windows/installer/8.0.html) installed and added to [system path](https://www.computerhope.com/issues/ch000549.htm) as 'mysql' (tested with v8.0.14)
- NodeJS (tested with v11.6.0)
- MariaDB (tested with v10.1.29)

# LAUNCH
As we are still on Beta Stage and don't want to release our crawler until we finish testing it properly as it will be the back-bone of the project this repo is included in, and we were getting some people calling to arms, we arranged a way of making the API and Front-end workable by everyone, even if the data is obviously outdated, it's structure is certainly not outdated. :D
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
- [Download MariaDB bootstrap file](https://drive.google.com/open?id=1xMMO0rq5mDuvj8Y1lHHzXG8RivPzfqEs) for provisional db from
- Run on terminal (in the folder where you have brs_crawler.sql file downloaded from link above):
```
mysql brs_crawler -u netX -pnetX < brs_crawler.sql
```
- Launch this repository with NodeJS:
  - Run on terminal:
```
npm run setup
node launcher.js
```
NOTE: [See USAGE.md for further information on scripts](https://github.com/gpedro34/BURST-NetX/blob/master/USAGE.md)

# SUGESTIONS
If you have a feature request, do a commit to the [SUGESTIONS.md file](https://github.com/gpedro34/BURST-NetX/blob/master/SUGESTIONS.md) in this repository.

# CONTRIBUTING
Report issues in the tracker or by tagging @gpedro in this [Discord](https://discord.gg/2RSeRaG).

Great PRs and commits get glorious and fame in the [CREDITS.md of this repository](https://github.com/gpedro34/BURST-NetX/blob/master/CREDITS.md)!

If you prefer to contribute with some BURST feel free to send it to BURST-R8SJ-V2FS-QF4V-DFMA9 or by using alias @NetX on BURST network. These funds will be used to fund further development.
