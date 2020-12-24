'use strict'

const fs = require('fs')
const exec = require('child_process').exec
const config = require('./config')

const dbOptions = config.mongoDBConn

Object.assign(dbOptions, config.mongoDBBackup)
/* return date object */
function stringToDate (dateString) {
  return new Date(dateString)
}
// Backup script
function dbBackUp () {
  console.log('Backup Started...')
  const date = new Date()
  let beforeDate, oldBackupDir, oldBackupPath
  const currentDate = stringToDate(date) // Current date
  const newBackupDir = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate()
  const newBackupPath = dbOptions.autoBackupPath + 'mongodump-' + newBackupDir // New backup path for current backup process
  // check for remove old backup after keeping # of days given in configuration
  if (dbOptions.removeOldBackup === true) {
    beforeDate = new Date(currentDate)
    beforeDate.setDate(beforeDate.getDate() - dbOptions.keepLastDaysBackup) // Substract number of days to keep backup and remove old backup
    oldBackupDir = beforeDate.getFullYear() + '-' + (beforeDate.getMonth() + 1) + '-' + beforeDate.getDate()
    oldBackupPath = dbOptions.autoBackupPath + 'mongodump-' + oldBackupDir // old backup(after keeping # of days)
  }
  let cmd = ''
  if (Object.prototype.hasOwnProperty.call(dbOptions, 'user') &&
      dbOptions.user.toString().trim() !== '' &&
      Object.prototype.hasOwnProperty.call(dbOptions, 'pass') &&
      dbOptions.pass.toString().trim() !== ''
  ) {
    cmd = 'mongodump --host ' + dbOptions.host + ' --port ' + dbOptions.port + ' --db ' + dbOptions.database + ' --username ' + dbOptions.user + ' --password ' + dbOptions.pass + ' --out ' + newBackupPath // Command for mongodb dump process
  } else {
    cmd = 'mongodump --host ' + dbOptions.host + ' --port ' + dbOptions.port + ' --db ' + dbOptions.database + ' --out ' + newBackupPath // Command for mongodb dump process
  }

  exec(cmd, function (error, stdout, stderr) {
    if (!error) {
      // check for remove old backup after keeping # of days given in configuration
      if (dbOptions.removeOldBackup === true) {
        console.log('Removing old backups if any...')
        if (fs.existsSync(oldBackupPath)) {
          exec('rm -rf ' + oldBackupPath, function (err) {
            console.log(err)
          })
          console.log('Backup Done...')
        } else {
          console.log('Backup Done...')
        }
      } else {
        console.log('Backup Done...')
      }
    } else {
      console.log(error)
    }
  })
}

dbBackUp()
