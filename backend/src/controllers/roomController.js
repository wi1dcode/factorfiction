const Room = require("../models/roomModel")

// Создание комнаты
const createRoom = async (data, socket, io) => {
  try {
    const { title, creator, interval } = data
    const code = Math.random().toString(36).substring(2, 8)

    const newRoom = new Room({
      creator,
      title,
      interval,
      code,
    })

    await newRoom.save()

    socket.join(code)
    socket.emit("roomCreated", newRoom)
  } catch (error) {
    console.error(error)
    socket.emit("error", { message: "Ошибка при создании комнаты" })
  }
}

// Добавление пользователя в комнату
const joinRoom = async (data, socket, io) => {
  try {
    const { roomCode, nickname } = data

    if (!nickname || typeof nickname !== "string") {
      socket.emit("error", { message: "Никнейм обязателен" })
      return
    }

    const room = await Room.findOne({ code: roomCode })
    if (!room) {
      socket.emit("error", { message: "Комната не найдена" })
      return
    }

    if (room.status !== "created") {
      socket.emit("error", { message: "Комната уже закрыта" })
      return
    }

    // Проверяем, существует ли игрок с данным никнеймом
    const existingPlayer = room.players.find(
      (player) => player.nickname === nickname
    )

    if (existingPlayer) {
      if (existingPlayer.status === "connected") {
        // Если игрок уже подключён и сокет совпадает, ничего не делаем
        if (existingPlayer.socketId === socket.id) {
          socket.emit("joinedRoom", {
            players: room.players.map((player) => ({
              nickname: player.nickname,
              status: player.status,
            })),
          })
          return
        }

        // Если игрок уже подключён с другим сокетом, отправляем ошибку
        socket.emit("error", { message: "Этот ник уже занят в комнате" })
        return
      }

      // Если игрок был отключён, обновляем его статус и привязываем новый сокет
      existingPlayer.status = "connected"
      existingPlayer.socketId = socket.id
    } else {
      // Если игрока с таким ником нет, добавляем нового
      room.players.push({ nickname, status: "connected", socketId: socket.id })
    }

    await room.save()

    socket.join(roomCode)

    // Отправляем список игроков текущему пользователю
    socket.emit("joinedRoom", {
      players: room.players.map((player) => ({
        nickname: player.nickname,
        status: player.status,
      })),
    })

    // Уведомляем других пользователей в комнате о новом подключении
    io.to(roomCode).emit("playerJoined", {
      players: room.players.map((player) => ({
        nickname: player.nickname,
        status: player.status,
      })),
    })
  } catch (error) {
    console.error("Ошибка в joinRoom:", error)
    socket.emit("error", { message: "Ошибка при присоединении к комнате" })
  }
}

const startGame = async (data, socket, io) => {
  try {
    const { roomCode, creator } = data

    const room = await Room.findOne({ code: roomCode })
    if (!room) {
      socket.emit("error", { message: "Комната не найдена" })
      return
    }

    if (room.creator !== creator) {
      socket.emit("error", {
        message: "Только создатель комнаты может начать игру",
      })
      return
    }

    if (room.players.length < 2) {
      socket.emit("error", {
        message: "Для начала игры необходимо минимум 2 игрока",
      })
      return
    }

    room.status = "process"
    await room.save()

    io.to(roomCode).emit("gameStarted", room)
  } catch (error) {
    console.error(error)
    socket.emit("error", { message: "Ошибка при старте игры" })
  }
}

// Подготовка игры: пользователи вводят свои истории
const submitStories = async (data, socket, io) => {
  try {
    const { roomCode, stories, nickname } = data

    const room = await Room.findOne({ code: roomCode })
    if (!room || room.status !== "process") {
      socket.emit("error", { message: "Игра не в процессе" })
      return
    }

    room.questions = room.questions.concat(
      stories.map((story) => ({ ...story, author: nickname }))
    )
    await room.save()

    io.to(roomCode).emit("storiesUpdated", room.questions)
  } catch (e) {
    console.log(e)
    socket.emit("error", { message: "Ошибка при отправке историй" })
  }
}

// Процесс голосования: игроки голосуют за истории друг друга
const voteStory = async (data, socket, io) => {
  try {
    const { roomCode, nickname, storyId, vote } = data

    const room = await Room.findOne({ code: roomCode })
    if (!room || room.status !== "process") {
      socket.emit("error", { message: "Игра не в процессе" })
      return
    }

    const story = room.questions.find((q) => q._id.toString() === storyId)
    if (!story) {
      socket.emit("error", { message: "История не найдена" })
      return
    }

    story.votes = story.votes || []
    story.votes.push({ nickname, vote })

    await room.save()

    io.to(roomCode).emit("voteRecorded", { nickname, storyId, vote })
  } catch (e) {
    console.log(e)
    socket.emit("error", { message: "Ошибка при голосовании" })
  }
}
// Завершение игры: подведение итогов и обновление счета
const endGame = async (roomCode, socket, io) => {
  try {
    const room = await Room.findOne({ code: roomCode })
    if (!room || room.status !== "process") {
      socket.emit("error", { message: "Игра не в процессе" })
      return
    }

    const results = new Map()

    room.questions.forEach((question) => {
      question.votes?.forEach((vote) => {
        if (vote.vote === question.truth) {
          results.set(vote.nickname, (results.get(vote.nickname) || 0) + 1)
        }
      })
    })

    room.results = Array.from(results).map(([player, score]) => ({
      player,
      score,
    }))
    room.status = "finished"
    await room.save()

    io.to(roomCode).emit("gameEnded", room.results)
  } catch (e) {
    console.log(e)
    socket.emit("error", { message: "Ошибка при завершении игры" })
  }
}

// Получение всех открытых комнат
const getAllOpenRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ type: "open" }).select(
      "title creator maxPlayers players interval status"
    )
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

const getRoomByCode = async (req, res) => {
  try {
    const { code } = req.params

    const room = await Room.findOne({ code })
    if (!room) {
      return res.status(404).json({ message: "Комната не найдена" })
    }

    res.status(200).json(room)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Ошибка при получении комнаты" })
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
  getRoomByCode,
}
