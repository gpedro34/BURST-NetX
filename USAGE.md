# Modes
* [Development](https://github.com/gpedro34/BURST-NetX/blob/master/USAGE.md#development-mode)
* [Production](https://github.com/gpedro34/BURST-NetX/blob/master/USAGE.md#production-mode)

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
- Configure your server by editing the defaults.js file in the 'config' folder
```
nano config/defaults.js
```
### Start:
- Starts Backend with builded React Frontend from folder 'fe-build' if folder exists and serves it at domain root path, if not do not serve anything at root path
```
node launcher.js
```
NOTE: Don't forget to set Environment Variable DOMAIN_API before building React source or your frontend will be doing the API calls to the API hosted at watchdog.burst-alliance.org domain
### Extra scripts:
- After having the builded frontend you may drop the development server (~240 Mb) using:
```
./clean-for-prod.sh
```
- If you want to serve Frontend and Backend in different servers instead, you can by doing so:
```
npm run prod-client
```
NOTE: Serves Frontend from 'fe-build' folder
