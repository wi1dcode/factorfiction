const db = require('../db/pool')

const roomService = {
  async findByCode(code) {
    const [rows] = await db.query('SELECT * FROM rooms WHERE code = ?', [code])
    return rows[0] || null
  },

  async create({ code, creator, intervalSec, voteSec }) {
    const [res] = await db.query(
      'INSERT INTO rooms (code, creator, interval_sec, vote_sec) VALUES (?, ?, ?, ?)',
      [code, creator, intervalSec, voteSec]
    )
    return res.insertId
  },

  async setStatus(roomId, status) {
    await db.query('UPDATE rooms SET status = ? WHERE id = ?', [status, roomId])
  },

  async setWriting(roomId) {
    await db.query(
      "UPDATE rooms SET status = 'writing', current_round_index = 0 WHERE id = ?",
      [roomId]
    )
  },

  async setVoting(roomId) {
    await db.query(
      "UPDATE rooms SET status = 'voting', current_round_index = 0 WHERE id = ?",
      [roomId]
    )
  },

  async setFinished(roomId) {
    await db.query("UPDATE rooms SET status = 'finished' WHERE id = ?", [roomId])
  },

  async incrementRound(roomId) {
    await db.query(
      'UPDATE rooms SET current_round_index = current_round_index + 1 WHERE id = ?',
      [roomId]
    )
  },

  async setRoundIndex(roomId, idx) {
    await db.query('UPDATE rooms SET current_round_index = ? WHERE id = ?', [idx, roomId])
  },

  async clearGameData(roomId) {
    await db.query('DELETE FROM stories WHERE room_id = ?',     [roomId])
    await db.query('DELETE FROM votes WHERE room_id = ?',       [roomId])
    await db.query('DELETE FROM results WHERE room_id = ?',     [roomId])
    await db.query('DELETE FROM round_order WHERE room_id = ?', [roomId])
  },
}

module.exports = roomService
