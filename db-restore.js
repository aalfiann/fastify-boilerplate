'use strict'
const exec = require('child_process').exec
const config = require('./config')
const yargs = require('yargs')
const options = yargs
  .usage('Restore MongoDB')
  .option('p', { alias: 'path', describe: 'Path of your MongoDB backup folder.', type: 'string', demandOption: true })
  .argv

// Backup script
function dbRestore () {
  console.log('Restore Started...')
  let cmd = ''
  if (Object.prototype.hasOwnProperty.call(config.mongoDBConn, 'user') &&
      config.mongoDBConn.user.toString().trim() !== '' &&
      Object.prototype.hasOwnProperty.call(config.mongoDBConn, 'pass') &&
      config.mongoDBConn.pass.toString().trim() !== ''
  ) {
    cmd = 'mongorestore --host ' + config.mongoDBConn.host + ' --port ' + config.mongoDBConn.port + ' --username ' + config.mongoDBConn.user + ' --password ' + config.mongoDBConn.pass + ' --db ' + config.mongoDBConn.database + ' ' + options.path // Command for mongodb restore process
  } else {
    cmd = 'mongorestore --host ' + config.mongoDBConn.host + ' --port ' + config.mongoDBConn.port + ' --db ' + config.mongoDBConn.database + ' ' + options.path // Command for mongodb restore process
  }

  exec(cmd, function (error, stdout, stderr) {
    if (!error) {
      console.log('Restore Done...')
    } else {
      console.log(error)
    }
  })
}

dbRestore()
