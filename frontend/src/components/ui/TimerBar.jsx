import React, { useEffect, useRef } from 'react'
import { C } from '../../utils/constants'

export default function TimerBar({ left, total, label }) {
  const pct       = Math.max(0, Math.min(100, (left / total) * 100))
  const isWarn    = pct < 50
  const isLow     = pct < 17
  const fillColor = isLow ? C.red : isWarn ? C.orange : C.greenL
  const wrapRef   = useRef(null)

  useEffect(() => {
    if (!wrapRef.current || left > 5 || left <= 0) return
    const el = wrapRef.current
    el.style.animation = 'shake 0.4s ease-in-out'
    const h = setTimeout(() => { if (el) el.style.animation = '' }, 420)
    return () => clearTimeout(h)
  }, [left])

  return (
    <div ref={wrapRef} className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="font-display font-black text-xs tracking-widest uppercase" style={{ color: C.dim }}>
          {label || '⏱ ОСТАЛОСЬ'}
        </span>
        <span className="font-mono font-bold tabular-nums text-sm transition-colors"
          style={{ color: fillColor }}>
          {left}<span className="text-xs ml-0.5" style={{ color: C.dim }}>с</span>
        </span>
      </div>

      <div className="relative h-7 rounded-full overflow-hidden"
        style={{ background: 'rgba(0,0,0,0.45)', boxShadow: '0 0 0 1px rgba(255,255,255,0.06)' }}>
        <div className="h-full rounded-full relative overflow-hidden"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${fillColor}cc, ${fillColor})`,
            boxShadow: `0 0 16px ${fillColor}88`,
            transition: 'width 1s linear',
          }}>
          {/* Shimmer */}
          <div className="absolute inset-y-0 w-12 -skew-x-12"
            style={{
              background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)',
              animation: 'shimmer 2.5s linear infinite',
              left: '-48px',
            }} />
          {/* Top shine */}
          <div className="absolute top-1 inset-x-2 h-1.5 rounded-full bg-white/20 pointer-events-none" />
        </div>
      </div>

      <div className="flex justify-between mt-1.5 px-0.5">
        {[0, Math.round(total * 0.25), Math.round(total * 0.5), Math.round(total * 0.75), total].map((v, i) => (
          <span key={i} className="font-mono text-[10px]" style={{ color: C.dim }}>{v}</span>
        ))}
      </div>
    </div>
  )
}
