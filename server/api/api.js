'use strict';

// API
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

// CORS Whitelists
var cors = require('cors');
let allowedOrigins = require('./../../config/defaults').webserver.whitelistCORS;
if(process.env.CORS_WHITELISTED){
  process.env.CORS_WHITELISTED.forEach((el)=>{
    allowedOrigins.push(el);
  });
}

// Add in here other front-end endpoints if needed
// It seems to not deal as well with wildcards as it says in documentation
allowedOrigins.push('http://localhost:3000')

const corsOptions = {
  origin: function(origin, callback){
    console.log(origin)
    // allow requests with no origin
    // (like mobile apps or curl requests)
    // if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(cors(corsOptions));

// API Routes
const peersRoutes = require('./routes/peers');
  // Get all peers or peers by Platform, Version or Height
  app.post('/api/peers', peersRoutes.peersPost);
  /* Takes a POST with raw JSON like:
    {"requestType": "peersByPlatform","platform": "brs"} or
    {"requestType": "peersByVersion","version": "1.1.1"} or
    {"requestType": "peersByHeight","platform": 500000} or
    {"requestType": "peers","start": 100,"howMany": "200"} or
    {"requestType": "peers"} - for default values (start:1; howMany:100)
  */
const peerRoutes = require('./routes/peer');
  // Get peer by ID or address
  /* Takes a POST with raw JSON like:
    {"id": 1} or
    {"address": "123.123.123.123:8123"}
  */
  app.post('/api/peer', peerRoutes.peerPost);

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
