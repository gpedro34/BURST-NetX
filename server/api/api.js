'use strict';

// API
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

//CORS middleware
const allowCrossDomain = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(allowCrossDomain);

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
