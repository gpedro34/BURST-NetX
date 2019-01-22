'use strict';

// Get peer by ID
exports.peerById = (req, res) => {
  const id = req.params.id;
  // Get peer by ID from DB

  // Send the results
  res.send({
    peer: {
      address: id
      //and rest of the data
    }
  })
}
// Get peer by Address
exports.peerByAddress = (req, res) => {
  const address = req.params.address;
  // Get peer by address from DB

  // Send the results
  res.send({
    peer:{
      address:"id"
      //and rest of the data
    }
  })
}
