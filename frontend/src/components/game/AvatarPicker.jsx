// AvatarPicker — compact selector with jelly bounce, matches Scene 7 style
import React, { useState } from "react"
import { AVATARS, PALETTE as p } from "../../utils/constants"

export default function AvatarPicker({ value, onChange, label }) {
  const [jelly, setJelly] = useState(false)
  const av = AVATARS[value % AVATARS.length]

  function pick(next) {
    onChange(next)
    setJelly(true)
    setTimeout(() => setJelly(false), 600)
  }

  return (
    <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
      {label && (
        <p
          className="font-display font-black text-xs tracking-widest uppercase"
          style={{ color: p.dim }}
        >
          {label}
        </p>
      )}
      <div className="flex items-center gap-2.5">
        {/* Prev */}
        <button
          onClick={() => pick((value - 1 + AVATARS.length) % AVATARS.length)}
          className="w-8 h-8 rounded-btn font-black text-xl flex items-center justify-center transition-all hover:scale-110 active:scale-90"
          style={{
            background: "rgba(0,0,0,0.3)",
            border: "2px solid rgba(255,255,255,0.15)",
            color: "#fff",
          }}
        >
          ‹
        </button>

        {/* Avatar blob */}
        <div
          className={`relative cursor-pointer ${jelly ? "animate-jelly" : ""}`}
          style={{ transformOrigin: "bottom center" }}
          onClick={() => pick((value + 1) % AVATARS.length)}
          title="Нажми для смены"
        >
          <div
            className="w-[88px] h-[88px] sm:w-[100px] sm:h-[100px] rounded-full flex items-center justify-center relative overflow-hidden transition-transform hover:scale-105"
            style={{
              background: av.color,
              border: "4px solid rgba(255,255,255,0.35)",
              boxShadow: `0 8px 0 rgba(0,0,0,0.3), 0 0 28px ${av.color}66`,
            }}
          >
            <span
              className="text-[44px] sm:text-[52px] select-none"
              style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.5))" }}
            >
              {av.emoji}
            </span>
            <div
              className="absolute top-[14%] left-[20%] w-[32%] h-[20%] bg-white/30 rounded-full blur-sm pointer-events-none"
              style={{ transform: "rotate(-25deg)" }}
            />
          </div>
          {/* Swap badge */}
          <div
            className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white flex items-center justify-center text-xs shadow-lg font-bold"
            style={{ border: `3px solid ${p.bg}` }}
          >
            🔀
          </div>
        </div>

        {/* Next */}
        <button
          onClick={() => pick((value + 1) % AVATARS.length)}
          className="w-8 h-8 rounded-btn font-black text-xl flex items-center justify-center transition-all hover:scale-110 active:scale-90"
          style={{
            background: "rgba(0,0,0,0.3)",
            border: "2px solid rgba(255,255,255,0.15)",
            color: "#fff",
          }}
        >
          ›
        </button>
      </div>
      <p
        className="font-display text-xs"
        style={{ color: "rgba(255,255,255,0.3)" }}
      >
        Нажми для смены
      </p>
    </div>
  )
}
