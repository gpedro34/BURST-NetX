'use strict';

// API
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// API Routes
const peersRoutes = require('./routes/peers');
  // Get all peers
  app.get('/api/peers/:start/:howmany', peersRoutes.peers);
  // Get peers by Platform, Version or Hight
  /* Takes a POST with raw JSON like:
    {"requestType": "peersbyPlatform","platform": "brs"} or
    {"requestType": "peersbyVersion","version": "1.1.1"} or
    {"requestType": "peersbyHeight","platform": "brs"}
  */
  app.post('/api/peers', peersRoutes.peersPost);
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
