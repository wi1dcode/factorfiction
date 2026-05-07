const db = require('../db/pool')

const storyService = {
  async getByAuthor(roomId, author) {
    const [rows] = await db.query(
      'SELECT * FROM stories WHERE room_id = ? AND author = ?',
      [roomId, author]
    )
    return rows
  },

  async countSubmitted(roomId) {
    const [rows] = await db.query(
      'SELECT COUNT(DISTINCT author) AS cnt FROM stories WHERE room_id = ?',
      [roomId]
    )
    return rows[0].cnt
  },

  async hasSubmitted(roomId, author) {
    const [rows] = await db.query(
      'SELECT COUNT(*) AS cnt FROM stories WHERE room_id = ? AND author = ?',
      [roomId, author]
    )
    return rows[0].cnt > 0
  },

  async addPair(roomId, author, truthText, lieText) {
    await db.query(
      'INSERT INTO stories (room_id, author, text, is_truth) VALUES (?, ?, ?, 1), (?, ?, ?, 0)',
      [roomId, author, truthText, roomId, author, lieText]
    )
  },

  async findById(storyId) {
    const [rows] = await db.query('SELECT * FROM stories WHERE id = ?', [storyId])
    return rows[0] || null
  },
}

module.exports = storyService
