const Room = require("../models/roomModel")
const authService = require("../services/authService")
const User = require("../models/userModel")

// Создание комнаты
const createRoom = async (data, socket) => {
  try {
    const { title, type, maxPlayers, author } = data

    const user = await User.findOne({ username: author })
    if (!user) {
      throw new Error("Пользователь не зарегистрирован")
    }

    const code = Math.random().toString(36).substring(2, 8).toUpperCase()

    const newRoom = new Room({
      creator: user._id,
      title,
      type,
      maxPlayers,
      code,
    })

    await newRoom.save()
    socket.join(newRoom._id.toString())
    socket.emit("roomCreated", newRoom)
  } catch (e) {
    console.log(e)
    socket.emit("error", { message: "Ошибка при создании комнаты" })
  }
}

// Добавление пользователя в комнату
const joinRoom = async (data, socket) => {
  try {
    const { roomCode, nickname, token } = data
    let userNickname = nickname

    if (token) {
      const userData = authService.validateAccessToken(token)
      userNickname = userData.username
    }

    const room = await Room.findOne({ code: roomCode })
    if (!room) {
      socket.emit("error", { message: "Комната не найдена" })
      return
    }

    if (room.status !== "created") {
      socket.emit("error", {
        message: "Нельзя присоединиться к игре в текущем состоянии",
      })
      return
    }

    if (room.players.includes(userNickname)) {
      socket.emit("error", { message: "Этот никнейм уже занят в комнате" })
      return
    }

    room.players.push(userNickname)
    await room.save()

    socket.join(roomCode)
    socket.to(roomCode).emit("playerJoined", userNickname)
  } catch (e) {
    console.log(e)
    socket.emit("error", { message: "Ошибка при присоединении к комнате" })
  }
}

const startGame = async (data, socket, io) => {
  try {
    const { roomCode, userId } = data

    const room = await Room.findOne({ code: roomCode })
    if (!room) {
      socket.emit("error", { message: "Комната не найдена" })
      return
    }

    if (room.creator.toString() !== userId) {
      socket.emit("error", {
        message: "Только создатель комнаты может начать игру",
      })
      return
    }

    if (room.status !== "created") {
      socket.emit("error", { message: "Игра уже началась или завершилась" })
      return
    }

    room.status = "process"
    await room.save()

    io.to(roomCode).emit("gameStarted", room)
  } catch (e) {
    console.log(e)
    socket.emit("error", { message: "Ошибка при начале игры" })
  }
}

// Подготовка игры: пользователи вводят свои истории
const submitStories = async (data, socket, io) => {
  const { roomId, stories, userNickname } = data

  const room = await Room.findById(roomId)
  if (!room || room.status !== "process") {
    socket.emit("error", { message: "Игра не в процессе" })
    return
  }

  room.questions = room.questions.concat(
    stories.map((story) => ({ ...story, author: userNickname }))
  )
  await room.save()

  io.to(roomId).emit("storiesUpdated", room.questions)
}

// Процесс голосования: игроки голосуют за истории друг друга
const voteStory = async (data, socket, io) => {
  const { roomId, userNickname, storyId, vote } = data

  const room = await Room.findById(roomId)
  if (!room || room.status !== "process") {
    socket.emit("error", { message: "Игра не в процессе" })
    return
  }

  // Найдем историю, за которую голосовали
  const story = room.questions.find((q) => q._id.toString() === storyId)
  if (!story) {
    socket.emit("error", { message: "История не найдена" })
    return
  }

  // Записываем голос
  story.votes = story.votes || []
  story.votes.push({ userNickname, vote })

  await room.save()

  io.to(roomId).emit("voteRecorded", { userNickname, storyId, vote })
}

// Завершение игры: подведение итогов и обновление счета
const endGame = async (roomId, socket, io) => {
  const room = await Room.findById(roomId)
  if (!room || room.status !== "process") {
    socket.emit("error", { message: "Игра не в процессе" })
    return
  }

  // Подсчет результатов
  const results = new Map() // Для хранения результатов игроков

  room.questions.forEach((question) => {
    question.votes.forEach((vote) => {
      if (vote.vote === question.truth) {
        results.set(
          vote.userNickname,
          (results.get(vote.userNickname) || 0) + 1
        )
      }
    })
  })

  // Обновляем счет игроков
  for (let [nickname, score] of results) {
    const user = await User.findOne({ username: nickname })
    if (user) {
      user.score += score
      await user.save()
    }
  }

  room.status = "finished"
  await room.save()

  io.to(roomId).emit("gameEnded", Array.from(results))
}

// Получение всех открытых комнат
const getAllOpenRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ type: "open" })
    res.json(rooms)
  } catch (e) {
    console.log(e)
    res.status(500).json({ message: "Ошибка при получении открытых комнат" })
  }
}

// Получение всех закрытых комнат
const getAllPrivateRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ type: "private" })
    res.json(rooms)
  } catch (e) {
    console.log(e)
    res.status(500).json({ message: "Ошибка при получении закрытых комнат" })
  }
}

const getRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
    if (!room) {
      return res.status(404).json({ message: "Комната не найдена" })
    }
    res.json(room)
  } catch (e) {
    console.log(e)
    res
      .status(500)
      .json({ message: "Ошибка при получении информации о комнате" })
  }
}

const updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
    if (!room) {
      return res.status(404).json({ message: "Комната не найдена" })
    }
    res.json(room)
  } catch (e) {
    console.log(e)
    res.status(500).json({ message: "Ошибка при обновлении комнаты" })
  }
}

const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id)
    if (!room) {
      return res.status(404).json({ message: "Комната не найдена" })
    }
    res.json({ message: "Комната удалена" })
  } catch (e) {
    console.log(e)
    res.status(500).json({ message: "Ошибка при удалении комнаты" })
  }
}

module.exports = {
  createRoom,
  joinRoom,
  getAllOpenRooms,
  getAllPrivateRooms,
  getRoom,
  updateRoom,
  deleteRoom,
  startGame,
  submitStories,
  voteStory,
  endGame,
}
