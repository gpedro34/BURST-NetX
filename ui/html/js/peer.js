function start(){
  var address = window.location.href;
  address = address.slice(address.indexOf('peer.html?')+10, address.length);
  var xhr = new XMLHttpRequest();
  xhr.open("GET", apiDomain+"peer?address="+address+"&uptimeTimetable=30-days", true);
  xhr.onload = function (e) {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        var response = JSON.parse(xhr.responseText);
        if(response.error === "There is no peer with such address"){
          response = {
            discovered: "Never",
            lastSeen: "Never",
            lastScanned: "Never",
            lastHeight: 0,
            platform: "N/A",
            version: "N/A",
            uptime: 0,
            info: [{
              apiPort: false,
              ip: 'No IP',
              blocked: 'Not a peer',
              city: 'N/A',
              country: 'N/A',
              lastScanned: 'N/A',
              ssl: 'Invalid',
              sslFrom: 'N/A',
              sslTo: 'N/A'
            }]
          }
        }
        document.getElementById("announced").innerHTML = address;
        var date = new Date(response.discovered).toGMTString();
        console.log(date)
        if(date === "Invalid Date"){
          date = 'Never seen'
        }
        document.getElementById("discovered").innerHTML = date;
        date = new Date(response.lastSeen).toGMTString();
        if(date === "Invalid Date"){
          date = 'Never seen'
        }
        document.getElementById("seen").innerHTML = date;
        date = new Date(response.lastScanned).toGMTString();
        if(date === "Invalid Date"){
          date = 'Never reached'
        }
        document.getElementById("scanned").innerHTML = date;
        document.getElementById("height").innerHTML = response.lastHeight;
        document.getElementById("platform").innerHTML = response.platform;
        document.getElementById("version").innerHTML = response.version;
        if(typeof response.uptime !== 'number'){
          response.uptime = "0.00";
        } else {
          response.uptime = response.uptime.toFixed(2);
        }
        document.getElementById("uptime").innerHTML = response.uptime+' %';
        for(var a = 0; a < response.info.length; a++){
          if(response.info[a].ip !== 'No IP' && response.info[a].ip !== 'N/A'){
            response.info[a].lastScanned = new Date(response.info[a].lastScanned).toGMTString();
            if(response.info[a].sslFrom !== 'N/A'){
              response.info[a].sslFrom = new Date(response.info[a].sslFrom).toGMTString()
            }
            if(response.info[a].sslTo !== 'N/A'){
              response.info[a].sslTo = new Date(response.info[a].sslTo).toGMTString();
            }
          }
          if(response.info[a].apiPort === false){
            response.info[a].apiPort = 'No';
          }
          document.getElementById("info").innerHTML += '<tr><td>'+response.info[a].ip+'</td><td>'+response.info[a].apiPort+'</td><td>'+response.info[a].blocked+'</td><td>'+response.info[a].city+'</td><td>'+response.info[a].country+'</td><td>'+response.info[a].ssl+'</td><td>'+response.info[a].lastScanned+'</td><td>'+response.info[a].sslFrom+'</td><td>'+response.info[a].sslTo+'</td></tr>';
          document.getElementById("loader").classList.add("hide");
          document.getElementById("topbar").classList.remove("hide");
          document.getElementById("peer").classList.remove("hide");
          document.getElementById("content").classList.remove("hide");
          document.getElementById("footer").classList.remove("hide");
        }
      } else {
        console.error(xhr.statusText);
      }
    }
  };
  xhr.onerror = function (e) {
    console.error(xhr.statusText);
  };
  xhr.send(null);
}
