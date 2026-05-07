import React from 'react'
import { C } from '../../utils/constants'

export default function RoundBadge({ index, total }) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full animate-pulse-soft"
      style={{
        background: `linear-gradient(135deg, ${C.purple}, ${C.purpleD})`,
        boxShadow: `0 4px 20px ${C.purple}55, 0 0 0 1px rgba(255,255,255,0.12)`,
      }}>
      <span className="font-display font-black text-xs tracking-widest text-white/60 uppercase">Раунд</span>
      <span className="font-display font-black text-xl text-shadow">{index + 1}</span>
      <span className="text-white/30 text-xs">/</span>
      <span className="font-display font-black text-base" style={{ color: C.yellowL }}>{total}</span>
    </div>
  )
}
