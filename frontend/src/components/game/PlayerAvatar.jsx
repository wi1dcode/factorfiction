// PlayerAvatar — matches Scene 7: blob circle, jelly on join, online dot, host star
import React, { useEffect, useRef } from 'react'
import { AVATARS, C } from '../../utils/constants'
const p = { bg: C.bg, success: C.greenL }

export default function PlayerAvatar({
  avatarIdx = 0,
  size = 'md',
  online = true,
  showStatus = true,
  isHost = false,
  isMe = false,
  justJoined = false,
}) {
  const av      = AVATARS[avatarIdx % AVATARS.length]
  const ref     = useRef(null)

  // Jelly bounce on join — matches design system animation
  useEffect(() => {
    if (!justJoined || !ref.current) return
    ref.current.style.animation = 'jelly 0.55s ease-in-out'
    const h = setTimeout(() => { if (ref.current) ref.current.style.animation = '' }, 600)
    return () => clearTimeout(h)
  }, [justJoined])

  const dim   = { sm: 40, md: 52, lg: 72, xl: 96 }[size] ?? 52
  const emoji = { sm: 20, md: 28, lg: 38, xl: 52 }[size] ?? 28
  const dotD  = { sm: 12, md: 14, lg: 18, xl: 22 }[size] ?? 14

  return (
    <div ref={ref} className="relative inline-flex flex-shrink-0"
      style={{ transformOrigin: 'bottom center' }}>
      {/* Avatar circle */}
      <div className="rounded-full flex items-center justify-center relative overflow-hidden"
        style={{
          width: dim, height: dim,
          background: av.color,
          border: `${dim > 60 ? 4 : 3}px solid rgba(255,255,255,0.28)`,
          boxShadow: `0 ${dim > 60 ? 6 : 4}px 0 rgba(0,0,0,0.3), 0 0 ${dim > 60 ? 24 : 14}px ${av.color}55`,
          opacity: online ? 1 : 0.5,
        }}>
        <span style={{ fontSize: emoji }}>{av.emoji}</span>
        {/* Top shine */}
        <div className="absolute top-[15%] left-[20%] w-[35%] h-[22%] bg-white/30 rounded-full blur-sm"
          style={{ transform: 'rotate(-25deg)' }} />
      </div>

      {/* Online dot */}
      {showStatus && (
        <div className="absolute -bottom-0.5 -right-0.5 rounded-full border-[3px]"
          style={{
            width: dotD, height: dotD,
            background: online ? p.success : '#555',
            borderColor: p.bg,
            boxShadow: online ? `0 0 8px ${p.success}` : 'none',
          }} />
      )}

      {/* Host star */}
      {isHost && (
        <div className="absolute -top-1.5 -right-2 text-lg animate-float2 select-none">⭐</div>
      )}
    </div>
  )
}
