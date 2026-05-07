require('dotenv').config()
const server = require('./app')
const db     = require('./db/pool')
const config = require('./config')
const logger = require('./utils/logger')

async function start() {
  try {
    await db.query('SELECT 1')
    logger.ok('MySQL connected')

    server.listen(config.port, () => {
      logger.ok(`Server running on port ${config.port} [${config.nodeEnv}]`)
    })
  } catch (err) {
    logger.error('Failed to start server:', err.message)
    process.exit(1)
  }
}

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled rejection:', reason)
})

process.on('uncaughtException', (err) => {
  logger.error('Uncaught exception:', err)
  process.exit(1)
})

start()
