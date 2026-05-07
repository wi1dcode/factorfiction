const db = require('../db/pool')

const voteService = {
  async hasVoted(roomId, roundAuthor, voter) {
    const [rows] = await db.query(
      'SELECT id FROM votes WHERE room_id = ? AND round_author = ? AND voter = ?',
      [roomId, roundAuthor, voter]
    )
    return rows.length > 0
  },

  async add(roomId, roundAuthor, voter, storyId) {
    await db.query(
      'INSERT INTO votes (room_id, round_author, voter, story_id) VALUES (?, ?, ?, ?)',
      [roomId, roundAuthor, voter, storyId]
    )
  },

  async getForAuthor(roomId, author) {
    const [rows] = await db.query(
      `SELECT v.voter, v.story_id, s.is_truth
       FROM votes v
       JOIN stories s ON v.story_id = s.id
       WHERE v.room_id = ? AND v.round_author = ?`,
      [roomId, author]
    )
    return rows
  },

  async getAllWithTruth(roomId) {
    const [rows] = await db.query(
      `SELECT v.voter, s.is_truth
       FROM votes v
       JOIN stories s ON v.story_id = s.id
       WHERE v.room_id = ?`,
      [roomId]
    )
    return rows
  },
}

module.exports = voteService
