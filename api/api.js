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
  app.get('/api/peers', peersRoutes.peers);
  // Get peers by Platform
  app.get('/api/peers/platform/:platform', peersRoutes.peersByPlatform);
  // Get peers by Version
  app.get('/api/peers/version/:version', peersRoutes.peersByVersion);
  // Get peers by Height
  app.get('/api/peers/height/:height', peersRoutes.peersByHeight);
const peerRoutes = require('./routes/peer');
  // Get peer by ID
  app.get('/api/peer/id/:id', peerRoutes.peerById);
  // Get peer by Address
  app.get('/api/peer/address/:address', peerRoutes.peerByAddress);

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
