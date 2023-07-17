import log from 'npmlog'

log.addLevel('success', 2000, { fg: 'green', bold: true }); // 添加自定义命令

if (process.argv.includes('--debug') || process.argv.includes('-d')) {
  log.level = 'verbose'
} else {
  log.level = 'info'
}

export default log
