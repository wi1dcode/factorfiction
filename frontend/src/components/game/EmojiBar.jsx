import React, { useState, useEffect, useRef } from 'react'
import { EMOJIS, C } from '../../utils/constants'

// ── Floating emoji particle ────────────────────────────────────────────────────
function EmojiParticle({ emoji, id, onDone }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const x = (Math.random() - 0.5) * 160
    el.animate([
      { transform: 'translate(-50%,-50%) scale(0.3)', opacity: 0 },
      { transform: `translate(calc(-50% + ${x * 0.3}px), calc(-50% - 40px)) scale(1.3)`, opacity: 1, offset: 0.3 },
      { transform: `translate(calc(-50% + ${x}px), calc(-50% - 120px)) scale(0.8)`, opacity: 0 },
    ], { duration: 1800, easing: 'ease-out', fill: 'forwards' }).onfinish = onDone
  }, [])
  return (
    <div ref={ref} className="fixed z-50 text-3xl pointer-events-none select-none"
      style={{ left: '50%', bottom: '80px', top: 'auto' }}>{emoji}</div>
  )
}

export default function EmojiBar({ onEmoji, flash }) {
  const [open, setOpen]       = useState(false)
  const [particles, setParticles] = useState([])

  function handleEmoji(em) {
    onEmoji(em)
    setOpen(false)
    const id = Date.now() + Math.random()
    setParticles(prev => [...prev, { id, emoji: em }])
    setTimeout(() => setParticles(prev => prev.filter(p => p.id !== id)), 2000)
  }

  return (
    <>
      {/* Flash popup from others */}
      {flash && (
        <div key={flash.key}
          className="fixed top-20 right-4 z-50 animate-scale-in glass-sm px-4 py-3 flex flex-col items-center gap-1">
          <span className="font-display font-black text-xs tracking-wider" style={{ color: C.dim }}>{flash.from}</span>
          <span className="text-4xl animate-tada">{flash.emoji}</span>
        </div>
      )}

      {/* Floating particles */}
      {particles.map(p => (
        <EmojiParticle key={p.id} id={p.id} emoji={p.emoji} onDone={() => {}} />
      ))}

      {/* Button + panel */}
      <div className="fixed bottom-6 right-4 z-40 flex flex-col items-end gap-2">
        {open && (
          <div className="glass animate-slide-up p-3 grid grid-cols-4 gap-1.5"
            style={{ minWidth: 200 }}>
            {EMOJIS.map(em => (
              <button key={em}
                onClick={() => handleEmoji(em)}
                className="w-12 h-12 text-2xl rounded-xl flex items-center justify-center transition-all hover:scale-125 active:scale-90 hover:bg-white/10">
                {em}
              </button>
            ))}
          </div>
        )}

        <button
          onClick={() => setOpen(o => !o)}
          className="w-14 h-14 rounded-full text-2xl transition-all hover:scale-110 active:scale-90 animate-pulse-soft"
          style={{
            background: `linear-gradient(135deg, ${C.purple}, ${C.purpleD})`,
            boxShadow: `0 4px 20px ${C.purple}66, 0 0 0 1px rgba(255,255,255,0.15)`,
          }}>
          {open ? '✕' : '😀'}
        </button>
      </div>
    </>
  )
}
