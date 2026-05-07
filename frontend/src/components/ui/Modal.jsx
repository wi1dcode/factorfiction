// Modal — scale-pop with backdrop dim, matches Scene 9
import React, { useEffect } from 'react'
import { PALETTE as p } from '../../utils/constants'

export default function Modal({ isOpen, onClose, title, children, accentColor }) {
  useEffect(() => {
    if (!isOpen) return
    const h = (e) => e.key === 'Escape' && onClose?.()
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}>
      <div className="card w-full max-w-md animate-bounce-in" onClick={e => e.stopPropagation()}>
        {/* Accent bar */}
        <div className="absolute top-0 inset-x-0 h-1.5 rounded-t-card"
          style={{ background: accentColor || `linear-gradient(90deg, ${p.primary}, ${p.secondary})` }} />
        <div className="p-6 pt-8">
          {title && (
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-black text-xl text-shadow" style={{ color: p.accent }}>{title}</h2>
              {onClose && (
                <button onClick={onClose}
                  className="w-9 h-9 rounded-[10px] bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-all font-bold text-lg">✕</button>
              )}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  )
}
