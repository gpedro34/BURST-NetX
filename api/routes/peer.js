'use strict';

// Get peer by ID
const peerById = (id) => {
  // Get peer by ID from DB

  // Ex. of how should be the object coming out of this function
  let obj = {
    peer: {
      address: id
      //and rest of the data
    }
  }
  return obj;
}
// Get peer by Address
const peerByAddress = (address) => {
  // Get peer by address from DB

  // Ex. of how should be the object coming out of this function
  let obj = {
    peer:{
      address:"id"
      // and rest of the data of the peer including uptime
    }
  }
  return obj
}
// Handles the POST request
exports.peerPost = (req, res) => {
  let obj;
  if(req.body.id){
    obj = await peerById(req.body.id)
  } else if(req.body.address){
    obj = await peerByAddress(req.body.address)
  } else {
    obj.status
  }
}
