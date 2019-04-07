if(!apiDomain){
  let apiDomain = 'BA';
}
apiDomain = apiDomain.toUpperCase();
switch(apiDomain){
  case 'WWW.WATCHDOG.BURST-ALLIANCE.ORG':
  case 'WATCHDOG.BURST-ALLIANCE.ORG':
  case 'BURST-ALLIANCE.ORG':
  case 'BURST-ALLIANCE':
  case 'BA':
  case 'BAT':
    if(useSSL){
      apiDomain = 'https://';
    } else {
      apiDomain = 'http://';
    }
    apiDomain += 'watchdog.burst-alliance.org/api/';
    break;
  case 'WWW.WATCHDOG.BURSTCOIN.PT':
  case 'WATCHDOG.BURSTCOIN.PT':
  case 'BURSTCOIN.PT':
  case 'PT':
  case 'TEST':
  case 'DEV':
    if(useSSL){
      apiDomain = 'https://';
    } else {
      apiDomain = 'http://';
    }
    apiDomain += 'watchdog.burstcoin.pt/api/';
    break;
  case 'LOCAL':
  case 'LOCALHOST':
  case 'PRODUCTION':
  case 'PROD':
    if(useSSL){
      apiDomain = 'https://';
    } else {
      apiDomain = 'http://';
    }
    apiDomain += 'localhost:'+domainPort+'/api/';
    break;
}
apiDomain = apiDomain.toLowerCase();

const SYSTEM = {
  'LINUX': 0,
  'WINDOWS': 1
}
if(!system){
  let system = 'LINUX';
}
system = system.toUpperCase();
const domain = window.location.pathname.substring(SYSTEM[system], window.location.pathname.lastIndexOf('/ui'));
