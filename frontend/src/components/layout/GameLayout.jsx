import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import AmbientBg from "./AmbientBg"
import { useLang } from "../../hooks/useLang"
import { LANGS } from "../../utils/i18n"
import { C } from "../../utils/constants"

// ── Live scoreboard strip ─────────────────────────────────────────────────────
export function ScoreStrip({ scores }) {
  if (!scores?.length) return null
  const sorted = [...scores].sort((a, b) => b.score - a.score)
  const MEDALS = ["🥇", "🥈", "🥉"]
  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5">
      {sorted.map((s, i) => (
        <div
          key={s.nickname}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full shrink-0 transition-all animate-score-up"
          style={{
            background:
              i === 0 ? "rgba(252,211,77,0.15)" : "rgba(255,255,255,0.05)",
            boxShadow:
              i === 0
                ? "0 0 0 1px rgba(252,211,77,0.3)"
                : "0 0 0 1px rgba(255,255,255,0.06)",
            animationDelay: `${i * 0.08}s`,
          }}
        >
          <span className="text-sm">{MEDALS[i] || "·"}</span>
          <span
            className="font-display font-black text-xs truncate max-w-[56px]"
            style={{ color: i === 0 ? C.yellowL : "rgba(255,255,255,0.85)" }}
          >
            {s.nickname}
          </span>
          <span
            className="font-mono font-bold text-xs"
            style={{ color: i === 0 ? C.yellowL : C.muted }}
          >
            {s.score}
          </span>
        </div>
      ))}
    </div>
  )
}

// ── How To Play Carousel ──────────────────────────────────────────────────────
function HowToModal({ onClose }) {
  const { t } = useLang()
  const [slide, setSlide] = useState(0)
  const steps = [
    {
      icon: "✍️",
      title: t("htp1t"),
      desc: t("htp1d"),
      grad: `linear-gradient(135deg,${C.purple},${C.pink})`,
    },
    {
      icon: "🕵️",
      title: t("htp2t"),
      desc: t("htp2d"),
      grad: `linear-gradient(135deg,${C.cyan},${C.purple})`,
    },
    {
      icon: "⚡",
      title: t("htp3t"),
      desc: t("htp3d"),
      grad: `linear-gradient(135deg,${C.yellowL},${C.orange})`,
    },
    {
      icon: "🏆",
      title: t("htp4t"),
      desc: t("htp4d"),
      grad: `linear-gradient(135deg,${C.greenL},${C.cyan})`,
    },
  ]
  const s = steps[slide]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(16px)" }}
      onClick={onClose}
    >
      <div
        className="glass neon-purple w-full max-w-sm animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1 rounded-t-3xl" style={{ background: s.grad }} />
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span
              className="font-display font-black text-lg"
              style={{
                background: s.grad,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {t("howToTitle")}
            </span>
            <button
              onClick={onClose}
              className="btn-ghost w-8 h-8 p-0 rounded-xl text-white/50 hover:text-white"
            >
              ✕
            </button>
          </div>
          <div
            key={slide}
            className="flex flex-col items-center text-center gap-4 py-6 min-h-[180px] animate-scale-in"
          >
            <span className="text-7xl animate-float">{s.icon}</span>
            <div
              className="font-display font-black text-2xl"
              style={{
                background: s.grad,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {s.title}
            </div>
            <p
              className="font-body text-sm leading-relaxed"
              style={{ color: C.muted }}
            >
              {s.desc}
            </p>
          </div>
          <div className="flex items-center justify-between mt-2">
            <button
              onClick={() => setSlide((v) => Math.max(0, v - 1))}
              disabled={slide === 0}
              className="btn-ghost px-4 py-2 text-sm disabled:opacity-20 rounded-xl"
            >
              ◀
            </button>
            <div className="flex gap-2">
              {steps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlide(i)}
                  className="w-2 h-2 rounded-full transition-all duration-200"
                  style={{
                    background:
                      i === slide ? C.yellowL : "rgba(255,255,255,0.2)",
                    transform: i === slide ? "scale(1.5)" : "scale(1)",
                  }}
                />
              ))}
            </div>
            {slide < steps.length - 1 ? (
              <button
                onClick={() => setSlide((v) => v + 1)}
                className="btn-purple px-4 py-2 text-sm rounded-xl"
              >
                ▶
              </button>
            ) : (
              <button
                onClick={onClose}
                className="btn-green px-4 py-2 text-sm rounded-xl"
              >
                {t("okBtn")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Language modal ────────────────────────────────────────────────────────────
function LangModal({ onClose }) {
  const { lang, changeLang, t } = useLang()
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(16px)" }}
      onClick={onClose}
    >
      <div
        className="glass neon-purple w-full max-w-xs p-5 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="font-display font-black text-base text-gradient-gold">
            {t("langTitle")}
          </span>
          <button
            onClick={onClose}
            className="btn-ghost w-8 h-8 p-0 rounded-xl text-white/50 hover:text-white"
          >
            ✕
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {LANGS.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                changeLang(l.code)
                onClose()
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl font-display font-black text-sm transition-all hover:scale-[1.02] active:scale-95"
              style={{
                background:
                  l.code === lang
                    ? "rgba(139,92,246,0.2)"
                    : "rgba(255,255,255,0.04)",
                boxShadow: `0 0 0 1px ${l.code === lang ? "rgba(139,92,246,0.5)" : "rgba(255,255,255,0.06)"}`,
                color: l.code === lang ? "#fff" : C.muted,
              }}
            >
              <span className="text-2xl">{l.flag}</span>
              {l.label}
              {l.code === lang && (
                <span className="ml-auto text-gradient-gold">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Players sidebar (xl screens, during game) ─────────────────────────────────
function PlayersSidebar({ players, nickname, stage, roundAuthor }) {
  const { t } = useLang()

  if (!players?.length) return null
  return (
    <div className="fixed right-3 top-[72px] z-30 xl:flex flex-col gap-1.5 hidden w-[164px]">
      <div className="glass-sm px-3 py-2 text-center mb-0.5">
        <span
          className="font-display font-black text-xs uppercase tracking-widest"
          style={{ color: C.dim }}
        >
          {t("playersLabel")}
        </span>
      </div>
      {players.map((pl, i) => {
        const online = pl.status === "connected"
        const isMe = pl.nickname === nickname
        const isAuth = stage === "voting" && pl.nickname === roundAuthor
        return (
          <div
            key={pl.nickname}
            className="glass-sm flex items-center gap-2 px-2.5 py-2 transition-all"
            style={
              isMe
                ? {
                    boxShadow:
                      "0 0 0 1px rgba(139,92,246,0.4), 0 0 20px rgba(139,92,246,0.1)",
                    background: "rgba(139,92,246,0.1)",
                  }
                : {}
            }
          >
            <div className="relative flex-shrink-0">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-sm"
                style={{
                  background: [
                    "#FF6B9D",
                    "#FFD93D",
                    "#6BCB77",
                    "#4D96FF",
                    "#C780FA",
                    "#FF8C42",
                    "#F472B6",
                    "#34D399",
                  ][i % 8],
                  opacity: online ? 1 : 0.4,
                }}
              >
                {["😎", "🤡", "🦊", "🐸", "👻", "🦄", "🐱", "🐉"][i % 8]}
              </div>
              <div
                className={online ? "dot-on" : "dot-off"}
                style={{
                  position: "absolute",
                  bottom: -1,
                  right: -1,
                  border: "2px solid #0d0520",
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="font-display font-black text-xs truncate"
                style={{ color: isMe ? "#a78bfa" : "#fff" }}
              >
                {pl.nickname}
                {isMe ? " (я)" : ""}
              </p>
              <p className="text-xs" style={{ color: C.dim }}>
                {!online
                  ? `💤 ${t("offline")}`
                  : isAuth
                    ? `👀 ${t("storiesOf").toLowerCase()}`
                    : stage === "voting"
                      ? `🗳 ${t("voting_s")}`
                      : `⏳ ${t("waiting_s")}`}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Main Layout ───────────────────────────────────────────────────────────────
export default function GameLayout({
  children,
  showHome = false,
  players = [],
  nickname = "",
  stage = "",
  roundAuthor = "",
  scores = [],
}) {
  const navigate = useNavigate()
  const { t, lang } = useLang()
  const [howTo, setHowTo] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const curLang = LANGS.find((l) => l.code === lang)

  return (
    <div
      className="min-h-screen flex flex-col relative"
      style={{ background: "#0d0520" }}
    >
      <AmbientBg />

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header
        className="relative z-20 flex items-center gap-3 px-4 sm:px-5 py-3"
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          background: "rgba(13,5,32,0.65)",
          backdropFilter: "blur(24px)",
        }}
      >
        {/* Left slot */}
        <div className="flex items-center shrink-0">
          {showHome && (
            <button
              onClick={() => navigate("/")}
              className="btn-ghost px-3 py-2 text-sm gap-1.5 rounded-xl"
            >
              🏠{" "}
              <span className="hidden sm:inline font-display font-black text-xs">
                {t("homeBtn")}
              </span>
            </button>
          )}
        </div>

        {/* Logo — always centred on mobile, left-ish on desktop */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-0.5 shrink-0 hover:scale-105 transition-transform active:scale-95 no-select"
        >
          <span className="font-display font-black text-xl sm:text-2xl text-shadow">
            FACTOR
          </span>
          <span className="font-display font-black text-xl sm:text-2xl text-gradient-gold text-shadow">
            FICTION
          </span>
          <span className="text-lg ml-0.5 animate-wiggle">🎭</span>
        </button>

        {/* Scoreboard strip — stretches in middle */}
        {scores.length > 0 && (
          <div className="flex-1 overflow-hidden px-3">
            <ScoreStrip scores={scores} />
          </div>
        )}
        {scores.length === 0 && <div className="flex-1" />}

        {/* Right slot — language button */}
        <button
          onClick={() => setLangOpen(true)}
          className="btn-ghost flex items-center gap-2 px-3 py-2 rounded-xl shrink-0"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-70"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          <span className="font-display font-black text-xs uppercase tracking-wider">
            {lang.toUpperCase()}
          </span>
        </button>
      </header>

      {/* Sidebar (xl, game only) */}
      {players.length > 0 && (
        <PlayersSidebar
          players={players}
          nickname={nickname}
          stage={stage}
          roundAuthor={roundAuthor}
        />
      )}

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-4 sm:px-6 py-6 gap-4">
        {children}
      </main>

      {/* Footer */}
      <footer
        className="relative z-10 py-4 px-4 text-center"
        style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
      >
        <div className="flex flex-wrap items-center justify-center gap-4 mb-1">
          {["telegram", "discord"].map((key) => (
            <a
              key={key}
              href="#"
              className="font-display font-black text-xs tracking-wider transition-colors hover:text-white hidden sm:inline"
              style={{ color: C.dim }}
            >
              {key === "telegram" ? "💬" : "🎮"} {t(key)}
            </a>
          ))}
        </div>
        <p
          className="font-display text-xs"
          style={{ color: "rgba(255,255,255,0.14)" }}
        >
          © 2025 FactorFiction
        </p>
      </footer>

      {howTo && <HowToModal onClose={() => setHowTo(false)} />}
      {langOpen && <LangModal onClose={() => setLangOpen(false)} />}
    </div>
  )
}
