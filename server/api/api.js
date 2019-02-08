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

// Logs to console
const logger = defaults.logger;
logger.mode = process.env.LOG_MODE || logger.mode;
logger.log = process.env.LOG || logger.log;
logger.interval = process.env.LOG_INTERVAL || logger.interval;
logger.size = process.env.LOG_SIZE || logger.size;
logger.compress = process.env.LOG_COMPRESS || logger.compress;
logger.maxSize = process.env.LOG_MAXSIZE || logger.maxSize;
logger.maxFiles = process.env.LOG_MAXFILES || logger.maxFiles;
logger.info = process.env.LOG_INFO || logger.info;
logger.name = process.env.LOG_NAME || logger.name;
logger.reqHeaders = process.env.LOG_REQ_HEAD || logger.reqHeaders;
logger.resHeaders = process.env.LOG_RES_HEAD || logger.resHeaders;
app.use(morgan(logger.mode, {
  skip: (req, res) => {
    return  req._parsedUrl.path.indexOf('static') != -1 ||
            req._parsedUrl.path.indexOf('manifest') != -1 ||
            req._parsedUrl.path.indexOf('favicon') != -1
    // Add future exceptions in here
  }
}));
// Logs to file
if(logger.log){
  const logs = require('./../logging/policy');
  let logInfo = '';
  if(logger.info[0]){
    logger.info.forEach((el)=>{
      logInfo += '"'+el+'"';
      if(el != logger.info[logger.info.length-1]){
        logInfo += ',';
      } else if(logger.reqHeaders[0]){
        logger.reqHeaders.forEach((el)=>{
          logInfo += '":req['+el+']"';
          if(el != logger.reqHeaders[logger.reqHeaders.length-1]){
            logInfo += ',';
          } else if(logger.resHeaders[0]){
            logger.resHeaders.forEach((el)=>{
              logInfo += '":res['+el+']"';
              if(el != logger.resHeaders[logger.resHeaders.length-1]){
                logInfo += ',';
              }
            })
          }
        })
      }
    })
  }
  app.use(morgan(logInfo, {
    stream: logs.accessLogStream
  }));
}

// Parsers for incoming data
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

// If in Bundle mode will serve frontend on domain root path
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
  // POST
  app.post('/api/peers', peersRoutes.peersPost);
  // REST GET
  app.get('/api/peers', (req, res)=>{
    if(req.query.requestType === 'getPeersById'){
      req.params.requestType = req.query.requestType;
      if(req.query.start){
        req.params.start = req.query.start;
      } else {
        req.params.start = 1;
      }
      if(req.query.howMany && req.query.howMany > 1 && req.query.howMany <= defaults.webserver.limitPeersPerAPIcall){
        req.params.howMany = req.query.howMany;
      } else {
        req.params.howMany = defaults.webserver.limitPeersPerAPIcall;
      }
    } else if(req.query.requestType === 'getPeersByPlatform'){
      req.params.requestType = req.query.requestType;
      if(req.query.id){
        req.params.requestType = 'getPeersByPlatformId'
        req.query.id = Number(req.query.id);
        if(!isNaN(req.query.id)){
          if(Number.isInteger(req.query.id)){
            req.params.id = req.query.id;
          } else {
            res.send({ "error": "'id' must be an integer" });
          }
        } else {
          res.send({ "error": "'id' must be a number" });
        }
      } else if(req.query.platform){
        req.params.platform = req.query.platform;
      } else {
        res.send({ "error": "You need to specify either a 'platform' or 'id' in your query" });
      }
    } else if(req.query.requestType === 'getPeersByVersion'){
      req.params.requestType = req.query.requestType;
      if(req.query.id){
        req.params.requestType = 'getPeersByVersionId'
        req.query.id = Number(req.query.id);
        if(!isNaN(req.query.id)){
          if(Number.isInteger(req.query.id)){
            req.params.id = req.query.id;
          } else {
            res.send({ "error": "'id' must be an integer" });
          }
        } else {
          res.send({ "error": "'id' must be a number" });
        }
      } else if(req.query.version){
        req.params.version = req.query.version;
      } else {
        res.send({ "error": "You need to specify either a 'version' or 'id' in your query" });
      }
    } else if(req.query.requestType === 'getPeersByHeight'){
      req.params.requestType = req.query.requestType;
      if(req.query.height){
        req.query.height = Number(req.query.height);
        if(!isNaN(req.query.height)){
          if(Number.isInteger(req.query.height)){
            req.params.height = req.query.height;
          } else {
            res.send({ "error": "'height' must be an integer" });
          }
        } else {
          res.send({ "error": "'height' must be a number" });
        }
      } else {
        res.send({ "error": "You need to specify a starting 'height' in your query" });
      }
    }
    peersRoutes.peersGet(req, res);
  });
const peerRoutes = require('./routes/peer');
  // Get peer by ID or address
  // POST
  app.post('/api/peer', peerRoutes.peerPost);
  // REST GET
  app.get('/api/peer', (req, res)=>{
    if(req.query.id){
      req.query.id = Number(req.query.id);
      if(Number.isInteger(req.query.id)){
        req.params.id = req.query.id;
        peerRoutes.peerGet(req, res);
      } else {
        res.send({ "error": "'id' must be a valid integer" });
      }
    } else if(req.query.address){
      req.params.address = req.query.address;
      peerRoutes.peerGet(req, res);
    } else {
      res.send({ "error": "You must specify a valid 'id' or 'address' in your query" });
    }
  });
// Search Engine Routes
if(defaults.webserver.searchEngine.searchQueries === true){
  const getAllRoutes = require('./routes/getAll');
    // Get all from asked table
    // REST GET
    app.get('/api/getAll', (req, res)=>{
      if(req.query.from === 'platforms' || req.query.from === 'versions' || req.query.from === 'peers' || req.query.from === 'scans'){
          getAllRoutes.allFrom(req, res);
      } else {
        res.send({ "error": "You must specify a valid 'from' query, being it 'platforms', 'versions', 'peers' or 'scans'" });
      }
    });
}
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
