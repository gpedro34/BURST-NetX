// CONSTANTS
let response = [['Country', 'Peers']];
let notCountries = 0;
let control = 0;
let ready = false;

// PAGES ACTIONS
// Start API calls to Watchdog API to get data for world map
function start(){
  get(1, true);
  var xhr = new XMLHttpRequest();
  xhr.open("GET", apiDomain+"getAll?from=checks&where=blocked&value=0", true);
  xhr.onload = function (e) {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        var res = JSON.parse(xhr.responseText);
        res = res.checks;
        console.log('A total of '+res.length+' peers were found not blocked')
        var xhr2 = new XMLHttpRequest();
        xhr2.open("GET", apiDomain+"getAll?from=locations", true);
        xhr2.onload = function (e) {
          if (xhr2.readyState === 4) {
            if (xhr2.status === 200) {
              var countries = JSON.parse(xhr2.responseText);
              countries = countries.locations;
              control = countries.length;
              for(var a = 0; a < countries.length; a++){
                var count = 0;
                for(var b = 0; b < res.length; b++){
                  if(res[b].locId === countries[a].id){
                    count++;
                  }
                  if(b === res.length-1){
                    addCountry(normalizeCountry(countries[a].country), count);
                  }
                }
              }
              ready = true;
            }
          }
        };
        xhr2.onerror = function (e) {
          console.error(xhr2.statusText);
        };
        xhr2.send(null);
      }
    }
  };
  xhr.onerror = function (e) {
    console.error(xhr.statusText);
  };
  xhr.send(null);
}
// Load API call
function get(start, op){
  if(!start || start <= 0){
    start = 1;
  }
  var xhr = new XMLHttpRequest();
  xhr.open("GET", apiDomain+"peers?requestType=getPeersById&start="+start, true);
  if(op){
    document.getElementById("loader-div").classList.remove("hide");
    document.getElementById("loader").classList.remove("hide");
    document.getElementById("topbar").classList.add("hide");
    document.getElementById("content").classList.add("hide");
    document.getElementById("page-div").classList.add("hide");
    document.getElementById("footer").classList.add("hide");
    document.getElementById("previous").classList.add("hide");
    document.getElementById("next").classList.add("hide");
  }
  xhr.onload = function (e) {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        const int = setInterval(()=>{
          if(ready){
            var response = JSON.parse(xhr.responseText);
            var div = document.getElementById('data');
            var table = document.createElement("table");
            table.classList.add("table");
            table.classList.add("center");
            var head = document.createElement("thead");
            head.classList.add("thead");
            head.id = "startHere";
            var headtd1 = document.createElement("td");
            var t1 = document.createTextNode("Address");
            headtd1.appendChild(t1);
            head.appendChild(headtd1);
            var headtd5 = document.createElement("td");
            var t5 = document.createTextNode("Country");
            headtd5.appendChild(t5);
            head.appendChild(headtd5);
            var headtd8 = document.createElement("td");
            var t8 = document.createTextNode("City");
            headtd8.appendChild(t8);
            head.appendChild(headtd8);
            var headtd6 = document.createElement("td");
            var t6 = document.createTextNode("Platform");
            headtd6.appendChild(t6);
            head.appendChild(headtd6);
            var headtd2 = document.createElement("td");
            var t2 = document.createTextNode("Version");
            headtd2.appendChild(t2);
            head.appendChild(headtd2);
            var headtd3 = document.createElement("td");
            var t3 = document.createTextNode("Uptime");
            headtd3.appendChild(t3);
            head.appendChild(headtd3);
            var headtd4 = document.createElement("td");
            var t4 = document.createTextNode("Height");
            headtd4.appendChild(t4);
            head.appendChild(headtd4);
            var headtd7 = document.createElement("td");
            var t7 = document.createTextNode("Status");
            headtd7.appendChild(t7);
            head.appendChild(headtd7);
            table.appendChild(head);
            var body = document.createElement("tbody");
            for(var a = 0; a < response.peers.length; a++){
              if(response.peers[a].version !== null && response.peers[a].platform !== null && response.peers[a].uptime !== null && response.peers[a].lastHeight !== null){
                var tr = document.createElement("tr");
                var td_address = document.createElement("td");
                var th_address = document.createTextNode(withoutPort(response.peers[a].address));
                var link = document.createElement('a');
                var font = document.createElement('font');
                font.color = "000000";
                link.href =  apiDomain.slice(0, apiDomain.indexOf('api/'))+'peer.html?'+response.peers[a].address;
                font.classList.add("link");
                font.appendChild(th_address);
                link.appendChild(font);
                td_address.appendChild(link);
                tr.appendChild(td_address);
                var td_country = document.createElement("td");
                var ip;
                for(var b = 0; b < response.peers[a].info.length; b++){
                  if(response.peers[a].info[b].blocked === 'Not Blocked'){
                    var th_country = document.createTextNode(response.peers[a].info[b].country);
                    td_country.appendChild(th_country);
                    tr.appendChild(td_country);
                    var td_city = document.createElement("td");
                    var th_city = document.createTextNode(response.peers[a].info[b].city);
                    td_city.appendChild(th_city);
                    tr.appendChild(td_city);
                    var td_platform = document.createElement("td");
                    var th_platform = document.createTextNode(response.peers[a].platform);
                    td_platform.appendChild(th_platform);
                    tr.appendChild(td_platform);
                    var td_version = document.createElement("td");
                    var th_version = document.createTextNode(response.peers[a].version);
                    td_version.appendChild(th_version);
                    tr.appendChild(td_version);
                    var td_uptime = document.createElement("td");
                    var th_uptime = document.createTextNode(response.peers[a].uptime.toFixed(2) + ' %');
                    td_uptime.appendChild(th_uptime);
                    tr.appendChild(td_uptime);
                    var td_height = document.createElement("td");
                    var th_height = document.createTextNode(response.peers[a].lastHeight);
                    td_height.appendChild(th_height);
                    tr.appendChild(td_height);
                    var td_status = document.createElement("td");
                    var th_status = document.createTextNode('Good');
                    td_status.appendChild(th_status);
                    tr.appendChild(td_status);
                    document.getElementById('peers').innerHTML = "";
                    document.getElementById('data').innerHTML = "";
                    body.appendChild(tr);
                    document.getElementById("page-div").classList.remove("hide");
                  }
                }
              } else {
                if(response.peers[a].platform === null){
                  response.peers[a].platform = '';
                }
                if(response.peers[a].version === null){
                  response.peers[a].version = '';
                }
                if(response.peers[a].uptime === null){
                  response.peers[a].uptime = 0;
                }
                if(response.peers[a].lastHeight === null){
                  response.peers[a].lastHeight = 0;
                }

                var tr = document.createElement("tr");
                var td_address = document.createElement("td");
                var th_address = document.createTextNode(withoutPort(response.peers[a].address));
                var link = document.createElement('a');
                var font = document.createElement('font');
                font.color = "000000";
                link.href =  apiDomain.slice(0, apiDomain.indexOf('api/'))+'peer.html?'+response.peers[a].address;
                font.appendChild(th_address);
                link.appendChild(font);
                td_address.appendChild(link);
                tr.appendChild(td_address);
                var td_country = document.createElement("td");
                for(var b = 0; b < response.peers[a].info.length; b++){
                  if(response.peers[a].info[b].blocked === 'Not Blocked'){
                    var th_country = document.createTextNode(response.peers[a].info[b].country);
                    td_country.appendChild(th_country);
                    tr.appendChild(td_country);
                    var td_city = document.createElement("td");
                    var th_city = document.createTextNode(response.peers[a].info[b].city);
                    td_city.appendChild(th_city);
                    tr.appendChild(td_city);
                    var td_platform = document.createElement("td");
                    var th_platform = document.createTextNode(response.peers[a].platform);
                    td_platform.appendChild(th_platform);
                    tr.appendChild(td_platform);
                    var td_version = document.createElement("td");
                    var th_version = document.createTextNode(response.peers[a].version);
                    td_version.appendChild(th_version);
                    tr.appendChild(td_version);
                    var td_uptime = document.createElement("td");
                    var th_uptime = document.createTextNode(response.peers[a].uptime.toFixed(2) + ' %');
                    td_uptime.appendChild(th_uptime);
                    tr.appendChild(td_uptime);
                    var td_height = document.createElement("td");
                    var th_height = document.createTextNode(response.peers[a].lastHeight);
                    td_height.appendChild(th_height);
                    tr.appendChild(td_height);
                    var td_status = document.createElement("td");
                    var th_status = document.createTextNode('Unreachable');
                    td_status.appendChild(th_status);
                    tr.appendChild(td_status);
                    body.appendChild(tr);
                  }
                }
              }
              if(a === response.peers.length-1){
                var peers = document.getElementById('peers');
                if(document.getElementById('page').innerHTML>1 && op === '-'){
                  document.getElementById('page').innerHTML--;
                } else if(op === '+' && response.peers[0].id === 1){
                  document.getElementById('page').innerHTML = 1;
                } else if(op === '+'){
                  document.getElementById('page').innerHTML++;
                }
                if(document.getElementById('page').innerHTML <= 1){
                  document.getElementById("previous").classList.add("hide");
                  document.getElementById("next").classList.remove("hide");
                } else {
                  document.getElementById("previous").classList.remove("hide");
                  document.getElementById("next").classList.remove("hide");
                }
                var lastPeer = document.createTextNode(response.peers[0].id+','+response.peers[a].id+','+(a+1));
                peers.appendChild(lastPeer);
              }
            }
           table.appendChild(body);
           div.appendChild(table);
           document.getElementById("loader-div").classList.add("hide");
           document.getElementById("loader").classList.add("hide");
           document.getElementById("topbar").classList.remove("hide");
           document.getElementById("content").classList.remove("hide");
           document.getElementById("page-div").classList.remove("hide");
           document.getElementById("footer").classList.remove("hide");
           clearInterval(int);
          }
        }, 10)
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
// Previous page
function getFromLastPrev(){
  var peers = document.getElementById('peers').innerHTML;
  var place = peers.indexOf(',');
  var firstPeer = Number(peers.slice(0, place));
  peers = peers.slice(peers.indexOf(',', place+1)+1, peers.length);
  if((firstPeer - peers) < peers){
    get(1, '-');
  } else {
    get(firstPeer - peers, '-');
  }
}
// Next page
function getFromLastNext(){
  var peers = document.getElementById('peers').innerHTML;
  var place = peers.indexOf(',');
  var lastPeer = peers.slice(peers.indexOf(',')+1, peers.indexOf(',', place+1));
  get(lastPeer++, '+');
}

// UTILS
// Gives back address without port
function withoutPort (address){
  let spot = 0;
  if(address.indexOf('[') >= 0){
    return address.slice(0, address.indexOf(']')+1);
  } else if(address.indexOf(':') > 0){
    return address.slice(0, address.indexOf(':'));
  } else {
    return address;
  }
}
// Normalize country as per dictionary.js
function normalizeCountry(country){
  if(country === 'Czechia'){
    country = 'Czech Republic';
  } else if(country.length === 2){
    country = dictionary[country];
  }
  return country;
}
// Adds country to the list to show on map
function addCountry(country, peers){
  if(country !== 'N/A' && peers > 0){
    let added = false;
    for(var a = 0; a < response.length; a++){
      // Increase peers of an already added country
      if(country === response[a][0]){
        response[a][1] += peers;
        added = true;
      }
      // Add country and peers
      if(a === response.length-1 && !added){
        response.push([country, peers]);
      }
    }
  } else {
    notCountries += peers;
  }
  control--;
  controller();
}
