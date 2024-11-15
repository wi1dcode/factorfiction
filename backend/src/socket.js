const roomController = require("./controllers/roomController")

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("Новое подключение")

    socket.on("createRoom", (data) => {
      roomController.createRoom(data, socket)
    })

    socket.on("joinRoom", (data) => {
      roomController.joinRoom(data, socket)
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

    socket.on("disconnect", () => {
      console.log("Пользователь отключился")
    })
  })
}
