'use strict';

const {lookup} = require('lookup-dns-cache');

exports.dnsPromise = (domain) => {
  return new Promise(
    (resolve, reject) => {
      lookup(domain, { all:false }, function(err, addr, fam){
        if (err) resolve('NOT FOUND');
        resolve(addr);
      })
     }
   );
 }
