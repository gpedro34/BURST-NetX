# Modes
* [Development](https://github.com/gpedro34/BURST-NetX/blob/master/USAGE.md#development-mode)
* [Production](https://github.com/gpedro34/BURST-NetX/blob/master/USAGE.md#production-mode)
* [Environment Variables](https://github.com/gpedro34/BURST-NetX/blob/master/USAGE.md#environment-variables)
  * [Webserver configuration](https://github.com/gpedro34/BURST-NetX/blob/master/USAGE.md#webserver-configuration)
  * [MariaDB Server configuration](https://github.com/gpedro34/BURST-NetX/blob/master/USAGE.md#mariadb-server-configuration)

## Development mode:
### Install:
- Basic setup (script for npm install in server and client projects)
```
./clean-dev-setup.sh
```
### Start:
- Starts Back-End and Front-End together (With Colors, Time and FE-BE tag)
```
node dev-launcher.js
```
or
- Starts just Back-End - without frontend builded React in 'fe-build' folder
```
npm start
```
and/or
- Starts just Front-End -  in development server mode (unbuilded React)
```
npm run dev-client
```

## Production mode:
### Install:
- Setup:
```
./clean-setup.sh
```
- Configure your server by editing the defaults.js file in the 'config' folder or setting up the necessary [environment variables](https://github.com/gpedro34/BURST-NetX/blob/master/USAGE.md#environment-variables).
```
nano config/defaults.js
```
### Start:
- Starts Backend with builded React Frontend from folder 'fe-build' if folder exists and serves it at domain root path, if not do not serve anything at root path
```
node launcher.js
```
NOTE: Don't forget to set [environment variable](https://github.com/gpedro34/BURST-NetX/blob/master/USAGE.md#environment-variables) DOMAIN_API before building React source or your frontend will be doing the API calls to the API hosted at [BURST Alliance](http://watchdog.burst-alliance.org) domain
### Extra scripts:
- Build React static source:
```
npm run build-client
```
- After having the builded frontend you may drop the development server (~240 Mb) using:
```
./clean-for-prod.sh
```
- If you want to serve Frontend and Backend in different servers instead, you can by doing so:
```
npm run prod-client
```
NOTE: Serves Frontend from 'fe-build' folder

## Environment variables:
### Webserver configuration:
* PORT - Integer
  * Port for the server to use
* BUNDLE_MODE - String
  * if set to PROD will try to serve builded react from 'fe-build' folder, if the folder does not exist this setting will be over-written during code execution
  * Default: 'PROD'
* DOMAIN_API - String
  * Domain to use for frontend to use for API calls to backend
  * Default: 'http://watchdog.burst-alliance.org/'
  * Set this before building React source code
* DOMAIN_FE - String
  * Domain origin of frontend. If set will automatically be CORS whitelisted
  * Optional  
  NOTE: Use this option if your deployment API isn't public and you want to serve your frontend anyway
* CORS_MODE - String
  * if set to OPEN will accept all API calls
  * if set to DEV will accept undefined origin API calls
  * Default: DEV  
  NOTE: CORS Whitelisted addresses will always be accepted independently of this mode.
* CORS_WHITELIST - Array
  * if set to ['http://localhost:5000'] will accept all API calls from localhost:5000. You can list as many as you like in here...
### MariaDB Connection configuration:
* DB_HOST - String
  * Host name or IP of the MariaDB server to connect
  * Default: localhost
* DB_PORT - Integer
  * Port to be used to connect to the MariaDB server
  * Default: 3306
* DB_USER - String
  * Username
  * Default: brs_crawler
* DB_PASS - String
  * Password
  * Default: brs_crawler
* DB_NAME - String
  * Database name
  * Default: brs_crawler
* DB_CON_LIMIT - Integer
  * Amount of simultaneous connections to keep in pool
  * Default: 10
### Console logging configurations:
* LOG_MODE - String
  * options: tiny, dev, combined, common, short
  * Refer to https://www.npmjs.com/package/morgan
  * Default: dev  
[For more information on logging data](https://www.npmjs.com/package/morgan)
### File logging configurations:
* LOG - Boolean
  * true to log to ./server/logging/logs/ folder
  * Default: false
* LOG_NAME - String
  * Any name to be appended to the log files name
  * Default: API
* LOG_INTERVAL - String
  * Maximum interval to rotate log files
  * Use s,m,h,d,M for time units
  * Default: 1d
* LOG_SIZE - String
  * Maximum size per log file
  * Use B,K,M,G for size units
  * Default: 10K
* LOG_COMPRESS - String
  * Support for gzip compression
  * Use false or 'gzip'
  * Default: false
* LOG_MAXSIZE - String
  * Maximum size the logs folder will take
  * Use B,K,M,G for size units
  * Default: 100M
* LOG_MAXFILES - Integer
  * Max number of log files to keep
  * Default: 30
* LOG_INFO - Array of strings
  * Information to include in logging
* LOG_REQ_HEAD - Array of Strings
  * Request headers to include in logging
* LOG_RES_HEAD - Array of Strings
  * Response headers to include in logging  
    
  [For more information on logging rotation](https://www.npmjs.com/package/rotating-file-stream)
