'use strict';

// Get all peers
exports.peers = (req, res) => {
  // Get all peers from db

  // Send the results
  res.send({
    peers:[
      {address: 'id'}
    ]
  })
}
// Get peers by Platform
exports.peersByPlatform = (req, res) => {
  const platform = req.params.platform;
  // Get peers by platform from DB

  // Send the results
  res.send({
    platform:{
      addresses:['addresses in here']
    }
  });
}
// Get peers by Version
exports.peersByVersion = (req, res) => {
  const version = req.params.version;
  // Get peers by platform from DB

  // Send the results
  res.send({
    versions:[
      {
        version:"name",
        addresses:['addresses in here']
      }
    ]
  })
}
// Get peers by Height
exports.peersByHeight = (req, res) => {
  const height = req.params.height;
  // Get peers by height from DB

  // Send the results
  res.send({
    heights:[
      {
        height:500000,
        addresses:['addresses in here']
      }
    ]
  })
}
