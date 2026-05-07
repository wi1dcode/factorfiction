const config      = require('../config')
const roomService   = require('../services/roomService')
const playerService = require('../services/playerService')
const storyService  = require('../services/storyService')
const voteService   = require('../services/voteService')
const roundService  = require('../services/roundService')
const { shuffle, generateRoomCode, formatPlayers } = require('../utils/helpers')
const { Errors } = require('../utils/errors')
const logger = require('../utils/logger')

// ─── helpers ────────────────────────────────────────────────────────────────

function emitError(socket, err) {
  socket.emit('gameError', { message: err.message, code: err.code || 'ERROR' })
}

// ─── createRoom ──────────────────────────────────────────────────────────────

async function createRoom(data, socket, io) {
  try {
    const { creator, intervalSec = config.game.defaultWriteSec, voteSec = config.game.defaultVoteSec } = data

    if (!creator?.trim()) return emitError(socket, Errors.INVALID_NICKNAME)

    const nick = creator.trim()
    const code = generateRoomCode()

    const roomId = await roomService.create({ code, creator: nick, intervalSec, voteSec })
    await playerService.add(roomId, nick, socket.id, data.avatarIdx ?? 0)

    socket.join(code)
    logger.game(`Room ${code} created by ${nick}`)

    socket.emit('roomCreated', {
      code, creator: nick, intervalSec, voteSec, status: 'waiting',
      players: [{ nickname: nick, avatarIdx: data.avatarIdx ?? 0, status: 'connected' }],
    })
  } catch (err) {
    logger.error('createRoom:', err)
    emitError(socket, { message: 'Ошибка при создании комнаты' })
  }
}

// ─── joinRoom ────────────────────────────────────────────────────────────────

async function joinRoom(data, socket, io) {
  try {
    const { roomCode, nickname, avatarIdx = 0 } = data

    if (!nickname?.trim()) return emitError(socket, Errors.INVALID_NICKNAME)

    const room = await roomService.findByCode(roomCode)
    if (!room)                          return emitError(socket, Errors.ROOM_NOT_FOUND)
    if (room.status === 'finished')     return emitError(socket, Errors.ROOM_FINISHED)

    const nick     = nickname.trim()
    const existing = await playerService.findInRoom(room.id, nick)

    if (existing) {
      await playerService.reconnect(room.id, nick, socket.id, avatarIdx)
    } else {
      if (room.status !== 'waiting')                          return emitError(socket, Errors.GAME_ALREADY_STARTED)
      const count = await playerService.countAll(room.id)
      if (count >= config.game.maxPlayers)                    return emitError(socket, Errors.ROOM_FULL)
      await playerService.add(room.id, nick, socket.id, avatarIdx)
    }

    socket.join(roomCode)

    const allPlayers = await playerService.getAll(room.id)
    const pp         = formatPlayers(allPlayers)

    // Reconnect state for mid-game rejoins
    const reconnectState = await buildReconnectState(room, nick)

    socket.emit('joinedRoom', {
      players: pp, creator: room.creator,
      intervalSec: room.interval_sec, voteSec: room.vote_sec,
      code: room.code, status: room.status, reconnectState,
    })

    io.to(roomCode).emit('playerJoined', { players: pp })
    logger.game(`${nick} joined room ${roomCode}`)
  } catch (err) {
    logger.error('joinRoom:', err)
    emitError(socket, { message: 'Ошибка при входе в комнату' })
  }
}

async function buildReconnectState(room, nickname) {
  if (room.status === 'writing') {
    const submitted = await storyService.hasSubmitted(room.id, nickname)
    return { stage: submitted ? 'waitingStories' : 'writing', intervalSec: room.interval_sec }
  }
  if (room.status === 'voting') {
    const order  = await roundService.getOrder(room.id)
    const author = order[room.current_round_index]
    if (!author) return null
    const stories = await storyService.getByAuthor(room.id, author)
    const votes   = await voteService.getForAuthor(room.id, author)
    return {
      stage: 'voting',
      currentRound: {
        author, roundIndex: room.current_round_index, totalRounds: order.length,
        stories: shuffle(stories).map(s => ({ id: s.id, text: s.text })),
      },
      votes:    votes.map(v => ({ voter: v.voter, storyId: v.story_id })),
      voteSec:  room.vote_sec,
    }
  }
  return null
}

// ─── startGame ───────────────────────────────────────────────────────────────

async function startGame(data, socket, io) {
  try {
    const { roomCode, creator } = data
    const room = await roomService.findByCode(roomCode)

    if (!room)                    return emitError(socket, Errors.ROOM_NOT_FOUND)
    if (room.creator !== creator) return emitError(socket, Errors.NOT_CREATOR)
    if (room.status !== 'waiting')return emitError(socket, Errors.GAME_ALREADY_STARTED)

    const players = await playerService.getConnected(room.id)
    if (players.length < config.game.minPlayers) return emitError(socket, Errors.NOT_ENOUGH_PLAYERS)

    await roomService.clearGameData(room.id)
    await roomService.setWriting(room.id)

    logger.game(`Game started in room ${roomCode} with ${players.length} players`)
    io.to(roomCode).emit('gameStarted', { intervalSec: room.interval_sec })
  } catch (err) {
    logger.error('startGame:', err)
    emitError(socket, { message: 'Ошибка при старте игры' })
  }
}

// ─── submitStories ───────────────────────────────────────────────────────────

async function submitStories(data, socket, io) {
  try {
    const { roomCode, nickname, stories } = data
    const room = await roomService.findByCode(roomCode)

    if (!room || room.status !== 'writing') return emitError(socket, Errors.WRITING_NOT_ACTIVE)
    if (!Array.isArray(stories) || stories.length !== 2) return emitError(socket, Errors.INVALID_STORIES)

    const alreadyDone = await storyService.hasSubmitted(room.id, nickname)
    if (alreadyDone) return emitError(socket, Errors.ALREADY_SUBMITTED)

    const truths = stories.filter(s => s.truth)
    const lies   = stories.filter(s => !s.truth)
    if (truths.length !== 1 || lies.length !== 1) return emitError(socket, Errors.INVALID_STORIES)

    await storyService.addPair(room.id, nickname, truths[0].text.trim(), lies[0].text.trim())

    const connected      = await playerService.getConnected(room.id)
    const submittedCount = await storyService.countSubmitted(room.id)
    const totalCount     = connected.length

    logger.game(`${nickname} submitted stories (${submittedCount}/${totalCount}) in ${roomCode}`)

    if (submittedCount >= totalCount) {
      await startVotingPhase(room, io)
    } else {
      io.to(roomCode).emit('playerSubmittedStory', {
        nickname, submitted: submittedCount, total: totalCount,
      })
    }
  } catch (err) {
    logger.error('submitStories:', err)
    emitError(socket, { message: 'Ошибка при отправке историй' })
  }
}

// ─── startVotingPhase ────────────────────────────────────────────────────────

async function startVotingPhase(room, io) {
  const connected = await playerService.getConnected(room.id)
  const order     = shuffle(connected.map(p => p.nickname))

  await roomService.setVoting(room.id)
  await roundService.saveOrder(room.id, order)

  logger.game(`Voting phase started in room ${room.code}, order: ${order.join(' → ')}`)
  await emitCurrentRound({ ...room, status: 'voting', current_round_index: 0 }, order, io)
}

// ─── emitCurrentRound ────────────────────────────────────────────────────────

async function emitCurrentRound(room, order, io) {
  if (!order?.length) order = await roundService.getOrder(room.id)

  const idx = room.current_round_index
  if (idx >= order.length) return finalizeGame(room, order, io)

  const author  = order[idx]
  const stories = await storyService.getByAuthor(room.id, author)

  if (stories.length < 2) {
    await roomService.incrementRound(room.id)
    return emitCurrentRound({ ...room, current_round_index: idx + 1 }, order, io)
  }

  const shuffled = shuffle(stories)
  logger.game(`Round ${idx + 1}/${order.length}: ${author}'s stories in ${room.code}`)

  io.to(room.code).emit('roundStarted', {
    author, roundIndex: idx, totalRounds: order.length,
    voteSec: room.vote_sec,
    stories: shuffled.map(s => ({ id: s.id, text: s.text })),
  })
}

// ─── voteStory ───────────────────────────────────────────────────────────────

async function voteStory(data, socket, io) {
  try {
    const { roomCode, nickname } = data
    const storyId = Number(data.storyId)

    const room = await roomService.findByCode(roomCode)
    if (!room || room.status !== 'voting') return emitError(socket, Errors.VOTING_NOT_ACTIVE)

    const order  = await roundService.getOrder(room.id)
    const author = order[room.current_round_index]
    if (!author) return emitError(socket, Errors.ROOM_NOT_FOUND)
    if (author === nickname) return emitError(socket, Errors.CANNOT_VOTE_OWN)

    const story = await storyService.findById(storyId)
    if (!story || story.room_id !== room.id || story.author !== author) {
      return emitError(socket, Errors.STORY_NOT_FOUND)
    }

    const alreadyVoted = await voteService.hasVoted(room.id, author, nickname)
    if (alreadyVoted) return emitError(socket, Errors.ALREADY_VOTED)

    await voteService.add(room.id, author, nickname, storyId)
    io.to(roomCode).emit('voteReceived', { voter: nickname, storyId })

    const connected = await playerService.getConnected(room.id)
    const eligible  = connected.filter(p => p.nickname !== author)
    const votes     = await voteService.getForAuthor(room.id, author)

    logger.game(`Vote in ${roomCode}: ${nickname} → story ${storyId} (${votes.length}/${eligible.length})`)

    if (votes.length >= eligible.length) {
      await finalizeRound(room, author, order, io)
    }
  } catch (err) {
    logger.error('voteStory:', err)
    emitError(socket, { message: 'Ошибка при голосовании' })
  }
}

// ─── finalizeRound ───────────────────────────────────────────────────────────

async function finalizeRound(room, author, order, io) {
  const stories = await storyService.getByAuthor(room.id, author)
  const votes   = await voteService.getForAuthor(room.id, author)

  io.to(room.code).emit('roundFinished', {
    author,
    roundIndex:  room.current_round_index,
    totalRounds: order.length,
    stories:     stories.map(s => ({ id: s.id, text: s.text, truth: !!s.is_truth })),
    votes:       votes.map(v => ({ voter: v.voter, storyId: v.story_id, correct: !!v.is_truth })),
  })
}

// ─── nextRound ───────────────────────────────────────────────────────────────

async function nextRound(data, socket, io) {
  try {
    const { roomCode, nickname } = data
    const room = await roomService.findByCode(roomCode)

    if (!room)                    return emitError(socket, Errors.ROOM_NOT_FOUND)
    if (room.creator !== nickname) return emitError(socket, Errors.NOT_CREATOR)

    const nextIndex = room.current_round_index + 1
    const order     = await roundService.getOrder(room.id)
    await roomService.setRoundIndex(room.id, nextIndex)

    if (nextIndex >= order.length) {
      await finalizeGame({ ...room, current_round_index: nextIndex }, order, io)
    } else {
      await emitCurrentRound({ ...room, current_round_index: nextIndex }, order, io)
    }
  } catch (err) {
    logger.error('nextRound:', err)
    emitError(socket, { message: 'Ошибка при переходе к следующему раунду' })
  }
}

// ─── finalizeGame ────────────────────────────────────────────────────────────

async function finalizeGame(room, order, io) {
  const allVotes   = await voteService.getAllWithTruth(room.id)
  const allPlayers = await playerService.getAll(room.id)

  const scores = {}
  for (const p of allPlayers) scores[p.nickname] = 0
  for (const v of allVotes) if (v.is_truth) scores[v.voter] = (scores[v.voter] || 0) + 1

  const results = Object.entries(scores)
    .map(([nickname, score]) => ({ nickname, score }))
    .sort((a, b) => b.score - a.score)

  await roomService.setFinished(room.id)
  await roundService.saveResults(room.id, results)
  await roundService.saveHistory(room.code, results[0]?.nickname || null, allPlayers.length)

  logger.game(`Game finished in ${room.code}. Winner: ${results[0]?.nickname}`)
  io.to(room.code).emit('gameEnded', { results, winner: results[0]?.nickname || null })
}

// ─── handleDisconnect ────────────────────────────────────────────────────────

async function handleDisconnect(socketId, io) {
  try {
    const player = await playerService.findBySocket(socketId)
    if (!player) return

    await playerService.disconnect(socketId)
    const allPlayers = await playerService.getAll(player.room_id)

    io.to(player.room_code).emit('playerDisconnected', {
      nickname: player.nickname,
      players:  formatPlayers(allPlayers),
    })

    logger.game(`${player.nickname} disconnected from ${player.room_code}`)

    // If writing phase and everyone submitted → start voting
    if (player.room_status === 'writing') {
      const room      = await roomService.findByCode(player.room_code)
      const connected = await playerService.getConnected(room.id)
      const submitted = await storyService.countSubmitted(room.id)
      if (connected.length > 0 && submitted >= connected.length) {
        await startVotingPhase(room, io)
      }
    }
  } catch (err) {
    logger.error('handleDisconnect:', err)
  }
}

// ─── sendEmoji ───────────────────────────────────────────────────────────────

function sendEmoji({ roomCode, nickname, emoji }, io) {
  io.to(roomCode).emit('emojiReceived', { nickname, emoji })
}

module.exports = {
  createRoom,
  joinRoom,
  startGame,
  submitStories,
  voteStory,
  nextRound,
  handleDisconnect,
  sendEmoji,
}
