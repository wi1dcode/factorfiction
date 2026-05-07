const db = require('../db/pool')

const playerService = {
  async findInRoom(roomId, nickname) {
    const [rows] = await db.query(
      'SELECT * FROM room_players WHERE room_id = ? AND nickname = ?',
      [roomId, nickname]
    )
    return rows[0] || null
  },

  async findBySocket(socketId) {
    const [rows] = await db.query(
      `SELECT rp.*, r.code AS room_code, r.status AS room_status, r.id AS room_id
       FROM room_players rp
       JOIN rooms r ON rp.room_id = r.id
       WHERE rp.socket_id = ? AND rp.status = 'connected'`,
      [socketId]
    )
    return rows[0] || null
  },

  async getAll(roomId) {
    const [rows] = await db.query(
      'SELECT * FROM room_players WHERE room_id = ? ORDER BY joined_at ASC',
      [roomId]
    )
    return rows
  },

  async getConnected(roomId) {
    const [rows] = await db.query(
      "SELECT * FROM room_players WHERE room_id = ? AND status = 'connected' ORDER BY joined_at ASC",
      [roomId]
    )
    return rows
  },

  async countAll(roomId) {
    const [rows] = await db.query(
      'SELECT COUNT(*) AS cnt FROM room_players WHERE room_id = ?',
      [roomId]
    )
    return rows[0].cnt
  },

  async add(roomId, nickname, socketId, avatarIdx = 0) {
    await db.query(
      'INSERT INTO room_players (room_id, nickname, socket_id, avatar_idx) VALUES (?, ?, ?, ?)',
      [roomId, nickname, socketId, avatarIdx]
    )
  },

  async reconnect(roomId, nickname, socketId, avatarIdx) {
    await db.query(
      "UPDATE room_players SET socket_id = ?, status = 'connected', avatar_idx = COALESCE(?, avatar_idx) WHERE room_id = ? AND nickname = ?",
      [socketId, avatarIdx ?? null, roomId, nickname]
    )
  },

  async disconnect(socketId) {
    await db.query(
      "UPDATE room_players SET status = 'disconnected' WHERE socket_id = ?",
      [socketId]
    )
  },
}

module.exports = playerService
