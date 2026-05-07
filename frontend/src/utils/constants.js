// Design tokens — single source of truth
export const C = {
  bg:         '#0d0520',
  purple:     '#7C3AED',
  purpleL:    '#8B5CF6',
  purpleD:    '#6D28D9',
  pink:       '#EC4899',
  pinkD:      '#DB2777',
  cyan:       '#06B6D4',
  cyanL:      '#22D3EE',
  green:      '#10B981',
  greenL:     '#34D399',
  yellow:     '#F59E0B',
  yellowL:    '#FCD34D',
  red:        '#EF4444',
  orange:     '#F97316',
  text:       '#ffffff',
  muted:      'rgba(255,255,255,0.55)',
  dim:        'rgba(255,255,255,0.28)',
  surface:    'rgba(255,255,255,0.04)',
  border:     'rgba(255,255,255,0.10)',
}

// Alias for backwards compat
export const PALETTE = {
  bg: C.bg, bgGrad: `linear-gradient(135deg,#0d0520,#1a0840)`,
  surface: C.surface, border: C.border, text: C.text, dim: C.dim,
  primary: C.purple, primaryDk: C.purpleD,
  secondary: C.pink, secondaryDk: C.pinkD,
  accent: C.yellowL, accentDk: C.yellow,
  success: C.greenL, successDk: C.green,
  warn: C.orange, warnDk: C.orange,
  danger: C.red,
}
export const p = PALETTE

export const AVATARS = [
  { color: '#FF6B9D', shadow: '#c0325e', emoji: '😎' },
  { color: '#FFD93D', shadow: '#b8960a', emoji: '🤡' },
  { color: '#6BCB77', shadow: '#2d8a3a', emoji: '🦊' },
  { color: '#4D96FF', shadow: '#1456b8', emoji: '🐸' },
  { color: '#C780FA', shadow: '#7c35c0', emoji: '👻' },
  { color: '#FF8C42', shadow: '#c04a0a', emoji: '🦄' },
  { color: '#F472B6', shadow: '#9d1e6e', emoji: '🐱' },
  { color: '#34D399', shadow: '#0a8060', emoji: '🐉' },
  { color: '#60A5FA', shadow: '#1d5cb8', emoji: '🦋' },
  { color: '#FBBF24', shadow: '#9a6a00', emoji: '🐺' },
]

export const EMOJIS = ['😂','😱','🤔','👍','🔥','😡','🎉','💀','👀','🤯','❤️','💯']

// Labels are now i18n keys: min1, min2, min3, min5
export const WRITE_TIMES = [
  { sec: 60,  key: 'min1' },
  { sec: 120, key: 'min2' },
  { sec: 180, key: 'min3' },
  { sec: 300, key: 'min5' },
]

export const MEDALS = ['🥇','🥈','🥉']

export const SOCKET_EVENTS = {
  CREATE_ROOM:    'createRoom',
  JOIN_ROOM:      'joinRoom',
  START_GAME:     'startGame',
  SUBMIT_STORIES: 'submitStories',
  VOTE_STORY:     'voteStory',
  NEXT_ROUND:     'nextRound',
  SEND_EMOJI:     'sendEmoji',
  ROOM_CREATED:   'roomCreated',
  JOINED_ROOM:    'joinedRoom',
  PLAYER_JOINED:  'playerJoined',
  PLAYER_LEFT:    'playerDisconnected',
  GAME_STARTED:   'gameStarted',
  PLAYER_SUBMITTED:'playerSubmittedStory',
  ROUND_STARTED:  'roundStarted',
  VOTE_RECEIVED:  'voteReceived',
  ROUND_FINISHED: 'roundFinished',
  GAME_ENDED:     'gameEnded',
  EMOJI_RECEIVED: 'emojiReceived',
  GAME_ERROR:     'gameError',
}
