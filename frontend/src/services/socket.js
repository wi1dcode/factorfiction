import { io } from 'socket.io-client'
import { SOCKET_EVENTS as E } from '../utils/constants'

let _socket = null

export function getSocket() {
  if (!_socket) {
    _socket = io(import.meta.env.VITE_BACKEND_URL || '', {
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1500,
    })
  }
  return _socket
}

// ── emit helpers ──────────────────────────────────────────────────────────────
export const createRoom    = (data) => getSocket().emit(E.CREATE_ROOM, data)
export const joinRoom      = (data) => getSocket().emit(E.JOIN_ROOM, data)
export const startGame     = (data) => getSocket().emit(E.START_GAME, data)
export const submitStories = (data) => getSocket().emit(E.SUBMIT_STORIES, data)
export const voteStory     = (data) => getSocket().emit(E.VOTE_STORY, data)
export const nextRound     = (data) => getSocket().emit(E.NEXT_ROUND, data)
export const sendEmoji     = (data) => getSocket().emit(E.SEND_EMOJI, data)

// ── listener helpers ──────────────────────────────────────────────────────────
export const on  = (event, cb) => { getSocket().on(event, cb); return () => getSocket().off(event, cb) }
export const off = (event, cb) => cb ? getSocket().off(event, cb) : getSocket().off(event)
