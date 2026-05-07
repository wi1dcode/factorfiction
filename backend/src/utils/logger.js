const config = require('../config')

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
}

function timestamp() {
  return new Date().toTimeString().slice(0, 8)
}

const logger = {
  info:  (...args) => console.log(`${colors.gray}[${timestamp()}]${colors.reset} ${colors.cyan}INFO${colors.reset}`, ...args),
  ok:    (...args) => console.log(`${colors.gray}[${timestamp()}]${colors.reset} ${colors.green} OK ${colors.reset}`, ...args),
  warn:  (...args) => console.warn(`${colors.gray}[${timestamp()}]${colors.reset} ${colors.yellow}WARN${colors.reset}`, ...args),
  error: (...args) => console.error(`${colors.gray}[${timestamp()}]${colors.reset} ${colors.red}ERR ${colors.reset}`, ...args),
  game:  (...args) => config.isDev && console.log(`${colors.gray}[${timestamp()}]${colors.reset} ${colors.yellow}GAME${colors.reset}`, ...args),
}

module.exports = logger
