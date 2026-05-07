import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import GameLayout from '../components/layout/GameLayout'
import { useToast } from '../components/ui/Toast'
import { useLang } from '../hooks/useLang'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useSocket } from '../hooks/useSocket'
import { joinRoom, startGame } from '../services/socket'
import { SOCKET_EVENTS as E, C, AVATARS } from '../utils/constants'

function PlayerCard({ player, idx, isMe, isHost, isNew, t }) {
  const av     = AVATARS[player.avatarIdx ?? idx % AVATARS.length]
  const online = player.status === 'connected'
  const [jelly, setJelly] = useState(false)

  useEffect(() => {
    if (!isNew) return
    setJelly(true)
    setTimeout(() => setJelly(false), 600)
  }, [isNew])

  return (
    <div className={`flex flex-col items-center gap-2 py-3 px-2 rounded-2xl transition-all duration-300 ${jelly ? 'animate-jelly' : ''}`}
      style={{
        background: isMe ? 'rgba(139,92,246,0.18)' : isHost ? 'rgba(245,158,11,0.1)' : 'rgba(255,255,255,0.04)',
        boxShadow: isMe ? '0 0 24px rgba(139,92,246,0.25)' : 'none',
      }}>
      <div className="relative">
        <div className="absolute inset-0 rounded-full"
          style={{ background: `${av.color}33`, transform: 'scale(1.4)', filter: 'blur(8px)', opacity: online ? 1 : 0 }} />
        <div className="relative w-12 h-12 rounded-full flex items-center justify-center"
          style={{
            background: `radial-gradient(circle at 35% 30%, ${av.color}, ${av.color}99)`,
            border: `2px solid ${av.color}77`,
            boxShadow: `0 4px 16px ${av.color}55`,
            opacity: online ? 1 : 0.35,
          }}>
          <span className="text-2xl select-none">{av.emoji}</span>
          <div className="absolute top-[10%] left-[18%] w-[30%] h-[18%] rounded-full bg-white/30 blur-sm" style={{ transform: 'rotate(-25deg)' }} />
        </div>
        <div className={online ? 'dot-on' : 'dot-off'} style={{ position: 'absolute', bottom: -1, right: -1, border: `2px solid ${C.bg}` }} />
        {isHost && <span className="absolute -top-2 -right-2 text-sm animate-float">⭐</span>}
      </div>
      <span className="font-display font-black text-xs text-center truncate w-full leading-tight" style={{ color: '#fff' }}>
        {player.nickname}
      </span>
      {isMe && (
        <span className="font-display font-black text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(139,92,246,0.35)', color: '#c4b5fd' }}>
          {t('you')}
        </span>
      )}
    </div>
  )
}

export default function Lobby() {
  const { code } = useParams()
  const navigate = useNavigate()
  const toast    = useToast()
  const { t }    = useLang()

  const [nickname]  = useLocalStorage('ff_nickname', '')
  const [avatarIdx] = useLocalStorage('ff_avatar', 0)
  const [players,     setPlayers]     = useState([])
  const [creator,     setCreator]     = useState('')
  const [intervalSec, setIntervalSec] = useState(60)
  const [codeCopied,  setCodeCopied]  = useState(false)
  const [linkCopied,  setLinkCopied]  = useState(false)
  const [newNicks,    setNewNicks]    = useState(new Set())

  const connected = players.filter(p => p.status === 'connected').length
  const isCreator = nickname === creator
  const canStart  = connected >= 2

  useEffect(() => {
    if (!nickname) { navigate('/'); return }
    joinRoom({ roomCode: code, nickname, avatarIdx })
  }, [])

  useSocket({
    [E.JOINED_ROOM]: (room) => {
      setPlayers(room.players)
      setCreator(room.creator)
      setIntervalSec(room.intervalSec || room.interval_sec || 60)
      localStorage.setItem(`ff_creator_${code}`, room.creator)
      if (room.status === 'writing' || room.status === 'voting') navigate(`/game/${code}`)
    },
    [E.PLAYER_JOINED]: ({ players: ps }) => {
      const prev = new Set(players.map(x => x.nickname))
      const fresh = new Set(ps.filter(x => !prev.has(x.nickname)).map(x => x.nickname))
      if (fresh.size) { setNewNicks(fresh); setTimeout(() => setNewNicks(new Set()), 800) }
      setPlayers(ps)
    },
    [E.PLAYER_LEFT]:  ({ players: ps }) => setPlayers(ps),
    [E.GAME_STARTED]: () => navigate(`/game/${code}`),
    [E.GAME_ERROR]:   ({ message }) => toast(message, 'error'),
  })

  return (
    <GameLayout showHome>
      <div className="w-full max-w-[480px] flex flex-col gap-8 animate-slide-up">

        {/* ── Room code — floating on bg ── */}
        <div className="flex flex-col items-center gap-3">
          <span className="font-display font-black text-xs tracking-widest uppercase" style={{ color: C.dim }}>
            {t('roomCodeLabel')}
          </span>
          {/* Letter tiles */}
          <button onClick={() => { navigator.clipboard.writeText(code).catch(()=>{}); setCodeCopied(true); setTimeout(()=>setCodeCopied(false),2000) }}
            className="flex gap-2 hover:scale-105 transition-transform active:scale-95">
            {code.split('').map((ch, i) => (
              <div key={i} className="w-13 h-16 rounded-2xl flex items-center justify-center font-mono font-black text-3xl"
                style={{
                  background: `rgba(253,224,71,0.12)`,
                  boxShadow: `0 0 20px rgba(253,224,71,0.3), 0 0 0 1px rgba(253,224,71,0.25)`,
                  color: C.yellowL,
                  width: 52, height: 62,
                }}>
                {ch}
              </div>
            ))}
          </button>
          <span className="font-display font-black text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            {codeCopied ? t('copied') : t('copyHint')}
          </span>
          <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/lobby/${code}`).then(()=>{setLinkCopied(true);setTimeout(()=>setLinkCopied(false),2000)}).catch(()=>{}) }}
            className="btn-ghost px-5 py-2 text-xs rounded-xl">
            {linkCopied ? '✅ Ссылка скопирована!' : `🔗 ${t('shareLink')}`}
          </button>
        </div>

        {/* ── Players grid — floating ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="font-display font-black text-sm tracking-widest uppercase" style={{ color: C.muted }}>
              👥 {t('players')}
            </span>
            <div className="flex items-center gap-3">
              <span className="font-display font-black">
                <span style={{ color: C.green }}>{connected}</span>
                <span style={{ color: C.dim }}> / </span>
                <span>{players.length}</span>
              </span>
              {canStart && (
                <span className="font-display font-black text-xs animate-pulse-soft" style={{ color: C.green }}>
                  ● {t('ready')}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {players.map((pl, i) => (
              <PlayerCard key={pl.nickname} player={pl} idx={i}
                isMe={pl.nickname === nickname} isHost={pl.nickname === creator}
                isNew={newNicks.has(pl.nickname)} t={t} />
            ))}
            {Array.from({ length: Math.max(0, 6 - players.length) }).map((_, i) => (
              <div key={`e${i}`} className="flex flex-col items-center gap-2 py-3 px-2 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.05)' }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                  style={{ border: '1px dashed rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.1)' }}>+</div>
                <span className="font-display text-[10px]" style={{ color: 'rgba(255,255,255,0.08)' }}>{t('slot')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Settings pills ── */}
        <div className="flex flex-wrap gap-2 justify-center">
          {[`⏱ ${intervalSec}с`, `🗳 30с`, `👥 min 2`].map(pill => (
            <span key={pill} className="font-display font-black text-xs px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(255,255,255,0.05)', color: C.muted }}>{pill}</span>
          ))}
        </div>

        {/* ── Action ── */}
        {isCreator ? (
          <div className="flex flex-col items-center gap-2">
            {!canStart && (
              <p className="font-display font-black text-xs tracking-wider animate-pulse-soft" style={{ color: C.yellowL }}>
                {t('needMore')}
              </p>
            )}
            <button onClick={() => startGame({ roomCode: code, creator: nickname })} disabled={!canStart}
              className="btn-green w-full py-5 text-2xl rounded-2xl">
              {t('startGame')}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4 justify-center">
            <span className="text-3xl animate-spin-slow">⏳</span>
            <div>
              <div className="font-display font-black text-sm">{t('waitCreator')}</div>
              <div className="font-body text-sm mt-0.5" style={{ color: C.muted }}>
                {t('creator')}: <span style={{ color: C.yellowL }}>{creator}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </GameLayout>
  )
}
