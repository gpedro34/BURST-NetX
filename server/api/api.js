'use strict';

// API
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

// CORS
var cors = require('cors');
const defaults = require('./../../config/defaults');
// CORS Whitelists
let allowedOrigins = defaults.webserver.whitelistCORS;
if(process.env.CORS_WHITELIST){
  if(process.env.DOMAIN_FE){
    allowedOrigins.push(process.env.DOMAIN_FE);
  }
  process.env.CORS_WHITELIST.forEach((el)=>{
    allowedOrigins.push(el);
  });
}
// CORS SETUP
const corsOptions = {
  origin: function(origin, callback){
    if(defaults.webserver.mode === 'OPEN' || process.env.CORS_MODE === 'OPEN'){
      // Public API - Allow all origins
      return callback(null, true);
    } else if(defaults.webserver.mode === "DEV" || process.env.CORS_MODE === 'DEV'){
      // Allows mobile and Postman calls
      if (origin === undefined){
        return callback(null, true);
      }
    } else if(allowedOrigins.indexOf(origin) === -1){
      // Block Request
      var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    // allow requests with no origin
    // (like mobile apps or curl requests)
    // if(!origin) return callback(null, true);
    return callback(null, true);
  }
}
app.use(cors(corsOptions));

// Logging
app.use(morgan('dev'));

// Parsers for incoming data
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

let bundleMode = process.env.BUNDLE_MODE || defaults.bundle.mode;
try{
  const checkBuild = require('./../../fe-build/manifest.json');
  bundleMode = 'PROD';
} catch {
  bundleMode = '';
}

if(bundleMode === 'PROD'){
  // Frontend served at http://localhost:5000/
  app.get('/', app.use(express.static('fe-build')));
}

// APi Docs at http://localhost:5000/docs
app.get('/docs', (req, res) => {
    res.redirect('https://documenter.getpostman.com/view/4955736/RztivWPm');
});

// API Routes
const peersRoutes = require('./routes/peers');
  // Get all peers or peers by Platform, Version or Height
  app.post('/api/peers', peersRoutes.peersPost);
  app.get('/api/getPeersById/:start', peersRoutes.peersGet);
  app.get('/api/getPeersById/:start/:howMany', peersRoutes.peersGet);
  app.get('/api/getPeersByPlatformId/:id', peersRoutes.peersGet);
  app.get('/api/getPeersByPlatform/:platform', peersRoutes.peersGet);
  app.get('/api/getPeersByVersionId/:id', peersRoutes.peersGet);
  app.get('/api/getPeersByVersion/:version', peersRoutes.peersGet);
  app.get('/api/getPeersByHeight/:height', peersRoutes.peersGet);
const peerRoutes = require('./routes/peer');
  // Get peer by ID or address
  app.post('/api/peer', peerRoutes.peerPost);
  app.get('/api/peerById/:id', peerRoutes.peerGet);
  app.get('/api/peerByAddress/:address', peerRoutes.peerGet);
// Invalid routes
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
})
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error:{
      message: error.message
    }
  })
})

module.exports = app;
