import log from 'npmlog'

if (process.argv.includes('--debug') || process.argv.includes('-d')) {
  log.level = 'verbose'
} else {
  log.level = 'info'
}

export default log
