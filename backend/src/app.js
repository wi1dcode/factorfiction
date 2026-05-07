const express  = require('express')
const http     = require('http')
const cors     = require('cors')
const path     = require('path')
const socketIo = require('socket.io')
const config   = require('./config')
const routes   = require('./routes')
const initSocket = require('./socket')
const { errorHandler, notFound } = require('./middlewares/errorHandler')

const app    = express()
const server = http.createServer(app)

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: config.frontendUrl, credentials: true }))
app.use(express.json())

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api', routes)

// ── Socket.IO ─────────────────────────────────────────────────────────────────
const io = socketIo(server, {
  cors: { origin: config.frontendUrl, methods: ['GET', 'POST'], credentials: true },
})
initSocket(io)

// ── Static (production) ───────────────────────────────────────────────────────
if (!config.isDev) {
  const distPath = path.join(__dirname, '..', '..', 'frontend', 'dist')
  app.use(express.static(distPath))
  app.get('*', (_, res) => res.sendFile(path.join(distPath, 'index.html')))
}

// ── Error Handlers ────────────────────────────────────────────────────────────
app.use(notFound)
app.use(errorHandler)

module.exports = server
