const roomController = require("./controllers/roomController")
const Room = require("./models/roomModel")

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("Новое подключение:", socket.id)

    socket.on("createRoom", (data) => {
      roomController.createRoom(data, socket, io)
    })

    socket.on("joinRoom", (data) => {
      roomController.joinRoom(data, socket, io)
    })

    socket.on("startGame", (data) => {
      roomController.startGame(data, socket, io)
    })

    socket.on("submitStories", (data) => {
      roomController.submitStories(data, socket, io)
    })

    socket.on("voteStory", (data) => {
      roomController.voteStory(data, socket, io)
    })

    socket.on("endGame", (roomId) => {
      roomController.endGame(roomId, socket, io)
    })

    socket.on("disconnect", async () => {
      try {
        const rooms = await Room.find()
        for (const room of rooms) {
          const player = room.players.find((p) => p.socketId === socket.id)
          if (player) {
            player.status = "disconnected" // Обновляем статус игрока
            await room.save()
            io.to(room.code).emit("playerDisconnected", {
              nickname: player.nickname,
              players: room.players.map((player) => ({
                nickname: player.nickname,
                status: player.status,
              })),
            })
          }
        }
      } catch (error) {
        console.error("Ошибка при обработке отключения:", error)
      }
    })
  })
}
