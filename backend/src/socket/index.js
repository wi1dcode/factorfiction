const gameController = require('../controllers/gameController')
const logger = require('../utils/logger')

module.exports = function initSocket(io) {
  io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.id}`)

    socket.on('createRoom',    (data) => gameController.createRoom(data, socket, io))
    socket.on('joinRoom',      (data) => gameController.joinRoom(data, socket, io))
    socket.on('startGame',     (data) => gameController.startGame(data, socket, io))
    socket.on('submitStories', (data) => gameController.submitStories(data, socket, io))
    socket.on('voteStory',     (data) => gameController.voteStory(data, socket, io))
    socket.on('nextRound',     (data) => gameController.nextRound(data, socket, io))
    socket.on('sendEmoji',     (data) => gameController.sendEmoji(data, io))

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}`)
      gameController.handleDisconnect(socket.id, io)
    })

    socket.on('error', (err) => {
      logger.error(`Socket error on ${socket.id}:`, err)
    })
  })
}
