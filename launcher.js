const concurrently = require('concurrently');
const chalk = require('chalk');
var exit = require('exit');

(async ()=>{
  const fail = await concurrently([
    {command: 'npm run server', name: 'BE', prefixColor: ['bold','bgRed']},
    {command: 'npm run client', name: 'FE', prefixColor: ['bold','bgBlue']},  ], {
      prefix: '[{time}-{name}]',
      timestampFormat: 'HH:mm:ss',
      killOthers: ['failure', 'success'],
      restartTries: 3,
  });
  if(!fail){
    console.log(chalk.underline.bold.black.bgCyan('All servers were closed sucessfully!'));
    exit(0)
  }
  console.error('Something went wrong... You might have some rogue NodeJS processes running!');

})()
