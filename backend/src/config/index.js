require('dotenv').config()

const config = {
  port: parseInt(process.env.PORT || '5000'),
  nodeEnv: process.env.NODE_ENV || 'development',
  isDev: (process.env.NODE_ENV || 'development') === 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',

  db: {
    host:     process.env.DB_HOST     || 'localhost',
    port:     parseInt(process.env.DB_PORT || '3306'),
    user:     process.env.DB_USER     || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME     || 'factorfiction',
  },

  game: {
    minPlayers:       2,
    maxPlayers:       10,
    defaultWriteSec:  60,
    defaultVoteSec:   30,
    codeLength:       6,
  },
}

module.exports = config
