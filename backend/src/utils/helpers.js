/**
 * Fisher-Yates shuffle
 */
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Generate a random alphanumeric room code
 */
function generateRoomCode(length = 6) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

/**
 * Format players for socket emission
 */
function formatPlayers(players) {
  return players.map(p => ({
    nickname:  p.nickname,
    avatarIdx: p.avatar_idx ?? 0,
    status:    p.status,
  }))
}

module.exports = { shuffle, generateRoomCode, formatPlayers }
