// Cartoon-style ambient background — large colour blobs + sparkle stars, NO grid
import React from 'react'

const ORBS = [
  { color: '124,58,237',  size: 680, x: '0%',   y: '0%',   dur: 20, delay: 0   },
  { color: '236,72,153',  size: 520, x: '85%',  y: '70%',  dur: 25, delay: -9  },
  { color: '6,182,212',   size: 380, x: '92%',  y: '5%',   dur: 30, delay: -17 },
  { color: '16,185,129',  size: 340, x: '20%',  y: '88%',  dur: 22, delay: -5  },
  { color: '245,158,11',  size: 280, x: '55%',  y: '50%',  dur: 18, delay: -13 },
]

// Fixed star positions — no random so no re-render flicker
const STARS = [
  { x: '8%',  y: '6%',  s: 3,   d: '0s'  }, { x: '24%', y: '3%',  s: 1.5, d: '1.1s' },
  { x: '50%', y: '8%',  s: 2,   d: '0.7s'}, { x: '72%', y: '4%',  s: 2.5, d: '2s'  },
  { x: '91%', y: '9%',  s: 1.5, d: '0.4s'}, { x: '15%', y: '22%', s: 1.5, d: '1.6s'},
  { x: '38%', y: '18%', s: 2,   d: '0.2s'}, { x: '63%', y: '25%', s: 1,   d: '1.9s'},
  { x: '82%', y: '30%', s: 2.5, d: '0.8s'}, { x: '5%',  y: '45%', s: 1.5, d: '2.2s'},
  { x: '78%', y: '50%', s: 1,   d: '0.5s'}, { x: '30%', y: '60%', s: 2,   d: '1.4s'},
  { x: '55%', y: '68%', s: 1.5, d: '0.9s'}, { x: '88%', y: '72%', s: 2,   d: '1.7s'},
  { x: '12%', y: '78%', s: 2.5, d: '0.3s'}, { x: '42%', y: '83%', s: 1,   d: '2.3s'},
  { x: '70%', y: '88%', s: 1.5, d: '1.2s'}, { x: '95%', y: '92%', s: 2,   d: '0.6s'},
]

export default function AmbientBg() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
      {/* Deep radial base */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 140% 80% at 50% -10%, #1e0d4a 0%, #0d0520 55%, #060212 100%)',
      }} />

      {/* Large drifting colour blobs — cartoon feel */}
      {ORBS.map((orb, i) => (
        <div key={i} className="absolute rounded-full will-change-transform"
          style={{
            width:  orb.size,
            height: orb.size,
            left:   orb.x,
            top:    orb.y,
            transform: 'translate(-50%, -50%)',
            background: `radial-gradient(circle, rgba(${orb.color},0.32) 0%, transparent 65%)`,
            filter: 'blur(60px)',
            animation: `drift ${orb.dur}s ease-in-out ${orb.delay}s infinite alternate`,
          }}
        />
      ))}

      {/* Vignette bottom */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 100% 60% at 50% 110%, rgba(0,0,0,0.7) 0%, transparent 60%)',
      }} />

      {/* Sparkle stars */}
      {STARS.map((s, i) => (
        <div key={i} className="absolute rounded-full bg-white"
          style={{
            left: s.x, top: s.y,
            width: s.s, height: s.s,
            opacity: 0,
            animation: `starTwinkle ${2.5 + i * 0.15}s ease-in-out ${s.d} infinite`,
          }}
        />
      ))}
    </div>
  )
}
