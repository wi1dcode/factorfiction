import React, { useEffect, useState } from 'react'
import { useLang } from '../../hooks/useLang'
import { C, AVATARS, MEDALS } from '../../utils/constants'

export default function FinishedStage({ results, nickname, onHome }) {
  const { t } = useLang()
  const sorted = [...results].sort((a, b) => b.score - a.score)
  const [displayed, setDisplayed] = useState(sorted.map(() => 0))

  useEffect(() => {
    let frame = 0
    const total = 60
    const id = setInterval(() => {
      frame++
      const ease = 1 - Math.pow(1 - Math.min(frame / total, 1), 3)
      setDisplayed(sorted.map(r => Math.round(r.score * ease)))
      if (frame >= total) clearInterval(id)
    }, 30)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="w-full max-w-md flex flex-col gap-7 animate-slide-up">

      <div className="text-center">
        <div className="text-7xl mb-3 animate-tada">🏆</div>
        <h2 className="font-display font-black text-3xl text-shadow">{t('gameOver')}</h2>
        <p className="font-body text-sm mt-1" style={{ color: C.muted }}>{t('bestDetective')}</p>
      </div>

      {/* Winner highlight — just glow, no card */}
      {sorted[0] && (
        <div className="flex flex-col items-center gap-3 py-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-full animate-glow-pulse"
              style={{ background: `${C.yellowL}44`, transform: 'scale(1.6)', filter: 'blur(20px)' }} />
            <div className="relative w-24 h-24 rounded-full flex items-center justify-center text-5xl"
              style={{
                background: `radial-gradient(circle at 35% 30%, ${AVATARS[0].color}, ${AVATARS[0].color}99)`,
                border: `4px solid ${AVATARS[0].color}88`,
                boxShadow: `0 8px 32px ${AVATARS[0].color}66`,
              }}>
              {AVATARS[0].emoji}
            </div>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-1">🥇</div>
            <p className="font-display font-black text-2xl text-gradient-gold">{sorted[0].nickname}</p>
            <p className="font-body text-sm" style={{ color: C.muted }}>{sorted[0].score} {t('points')}</p>
          </div>
          {sorted[0].nickname === nickname && (
            <span className="pill animate-wiggle font-black" style={{ background: C.yellowL, color: '#1a0848' }}>
              {t('itsYou')}
            </span>
          )}
        </div>
      )}

      {/* Leaderboard — floating rows */}
      <div className="flex flex-col gap-2">
        {sorted.map((r, i) => {
          const isMe     = r.nickname === nickname
          const isLeader = i === 0
          const av       = AVATARS[i % AVATARS.length]
          return (
            <div key={r.nickname}
              className="flex items-center gap-3 px-3 py-3 rounded-2xl transition-all animate-slide-up"
              style={{
                animationDelay: `${i * 0.06}s`,
                background: isMe     ? 'rgba(139,92,246,0.18)' :
                            isLeader ? 'rgba(253,224,71,0.1)'  : 'rgba(255,255,255,0.04)',
                boxShadow: isMe     ? '0 0 20px rgba(139,92,246,0.2)' :
                           isLeader ? `0 0 20px rgba(253,224,71,0.15)` : 'none',
              }}>
              <span className="text-2xl w-8 text-center flex-shrink-0">{MEDALS[i] || `${i + 1}`}</span>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: `radial-gradient(circle at 35% 30%, ${av.color}, ${av.color}99)`, border: `2px solid ${av.color}66` }}>
                {av.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display font-bold text-sm truncate"
                  style={{ color: isMe ? '#c4b5fd' : isLeader ? C.yellowL : '#fff' }}>
                  {r.nickname} {isMe && `(${t('you')})`}
                </p>
              </div>
              <div className="font-mono font-bold text-lg tabular-nums flex-shrink-0"
                style={{ color: isLeader ? C.yellowL : '#fff' }}>
                {displayed[i]}
                <span className="font-display text-xs ml-1" style={{ color: C.muted }}>{t('pts')}</span>
              </div>
            </div>
          )
        })}
      </div>

      <button onClick={onHome} className="btn-ghost w-full py-4 text-xl rounded-2xl">
        {t('goHome')}
      </button>
    </div>
  )
}
