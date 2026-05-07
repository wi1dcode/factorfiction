const db = require('../db/pool')

const roundService = {
  async getOrder(roomId) {
    const [rows] = await db.query(
      'SELECT nickname FROM round_order WHERE room_id = ? ORDER BY position ASC',
      [roomId]
    )
    return rows.map(r => r.nickname)
  },

  async saveOrder(roomId, nicknames) {
    if (!nicknames.length) return
    const values = nicknames.map((nick, i) => [roomId, i, nick])
    await db.query(
      'INSERT INTO round_order (room_id, position, nickname) VALUES ?',
      [values]
    )
  },

  async saveResults(roomId, scores) {
    if (!scores.length) return
    const vals = scores.map(s => [roomId, s.nickname, s.score])
    await db.query(
      'INSERT INTO results (room_id, nickname, score) VALUES ? ON DUPLICATE KEY UPDATE score = VALUES(score)',
      [vals]
    )
  },

  async saveHistory(roomCode, winner, totalPlayers) {
    await db.query(
      'INSERT INTO game_history (room_code, winner, total_players) VALUES (?, ?, ?)',
      [roomCode, winner, totalPlayers]
    )
  },
}

module.exports = roundService
