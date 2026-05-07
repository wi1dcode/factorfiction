import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import GameLayout from '../components/layout/GameLayout'
import { useToast } from '../components/ui/Toast'
import { useLang } from '../hooks/useLang'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useSocket } from '../hooks/useSocket'
import { createRoom, joinRoom } from '../services/socket'
import { SOCKET_EVENTS as E, WRITE_TIMES, C, AVATARS } from '../utils/constants'

// ── Avatar orb ────────────────────────────────────────────────────────────────
function AvatarOrb({ idx, onChange, t }) {
  const av = AVATARS[idx % AVATARS.length]
  const [hover, setHover] = useState(false)
  return (
    <div className="flex flex-col items-center gap-2 shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange((idx - 1 + AVATARS.length) % AVATARS.length)}
          className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-xl transition-all hover:scale-110 active:scale-90"
          style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)' }}>
          ‹
        </button>

        <div
          className="relative cursor-pointer"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={() => onChange((idx + 1) % AVATARS.length)}
        >
          <div
            className="absolute inset-0 rounded-full animate-glow-pulse"
            style={{
              background: `radial-gradient(circle, ${av.color}55 0%, transparent 70%)`,
              transform: 'scale(1.5)',
              filter: 'blur(16px)',
            }}
          />
          <div
            className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-transform duration-300 ${hover ? 'scale-110 animate-jelly' : ''}`}
            style={{
              background: `radial-gradient(circle at 35% 30%, ${av.color}ff, ${av.color}99)`,
              border: `3px solid ${av.color}88`,
              boxShadow: `0 8px 32px ${av.color}66, 0 0 0 8px ${av.color}15`,
            }}
          >
            <span className="text-5xl select-none" style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.6))' }}>
              {av.emoji}
            </span>
            <div
              className="absolute top-3 left-4 w-8 h-5 rounded-full bg-white/25 blur-sm pointer-events-none"
              style={{ transform: 'rotate(-25deg)' }}
            />
          </div>
        </div>

        <button
          onClick={() => onChange((idx + 1) % AVATARS.length)}
          className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-xl transition-all hover:scale-110 active:scale-90"
          style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)' }}>
          ›
        </button>
      </div>
      <span className="font-display font-black text-xs tracking-widest" style={{ color: C.dim }}>
        {t('changeChar')}
      </span>
    </div>
  )
}

// ── Code letter boxes ─────────────────────────────────────────────────────────
function CodeLetters({ value }) {
  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl flex items-center justify-center font-mono font-black text-2xl transition-all duration-200"
          style={{
            width: 44,
            height: 52,
            ...(value[i]
              ? {
                  background: 'rgba(139,92,246,0.25)',
                  boxShadow: '0 0 20px rgba(139,92,246,0.5), 0 0 0 1px rgba(139,92,246,0.4)',
                  color: C.yellowL,
                }
              : {
                  background: 'rgba(255,255,255,0.05)',
                  boxShadow: '0 0 0 1px rgba(255,255,255,0.07)',
                  color: 'rgba(255,255,255,0.2)',
                }),
          }}
        >
          {value[i] || '·'}
        </div>
      ))}
    </div>
  )
}

// ── How To Play Swiper ────────────────────────────────────────────────────────
// Uses absolute-positioned slides with opacity + translateX — avoids all
// flex-width % bugs and double-style prop errors.
function HowToSwiper({ t }) {
  const [slide, setSlide] = useState(0)
  const startX = useRef(0)
  const dragging = useRef(false)

  const steps = [
    { icon: '✍️', num: '01', grad: `linear-gradient(135deg,${C.purple},${C.pink})`,    tk: 'htp1t', dk: 'htp1d' },
    { icon: '🕵️', num: '02', grad: `linear-gradient(135deg,${C.cyan},${C.purple})`,    tk: 'htp2t', dk: 'htp2d' },
    { icon: '⚡',  num: '03', grad: `linear-gradient(135deg,${C.yellowL},${C.orange})`, tk: 'htp3t', dk: 'htp3d' },
    { icon: '🏆', num: '04', grad: `linear-gradient(135deg,${C.greenL},${C.cyan})`,     tk: 'htp4t', dk: 'htp4d' },
  ]
  const n = steps.length

  // Auto-advance every 3.5 s
  useEffect(() => {
    const id = setInterval(() => setSlide(s => (s + 1) % n), 3500)
    return () => clearInterval(id)
  }, [n])

  // Pointer drag
  function onPointerDown(e) {
    startX.current = e.clientX
    dragging.current = true
  }
  function onPointerUp(e) {
    if (!dragging.current) return
    dragging.current = false
    const diff = startX.current - e.clientX
    if (Math.abs(diff) > 40)
      setSlide(s => (diff > 0 ? Math.min(s + 1, n - 1) : Math.max(s - 1, 0)))
  }
  function onPointerLeave() { dragging.current = false }

  return (
    <div className="flex flex-col w-full">
      {/* Badge */}
      <div className="mb-5 flex justify-center lg:justify-start">
        <span
          className="pill text-white"
          style={{
            background: `linear-gradient(135deg,${C.pink},${C.orange})`,
            boxShadow: `0 4px 20px ${C.pink}55`,
          }}
        >
          📖 {t('howToPlay')}
        </span>
      </div>

      {/* Viewport — fixed height, clips overflow */}
      <div
        className="relative overflow-hidden"
        style={{ height: 220, cursor: 'grab', userSelect: 'none', touchAction: 'pan-y' }}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerLeave}
      >
        {steps.map((step, i) => {
          const offset = i - slide          // -1  0  1  2  …
          const visible = Math.abs(offset) <= 1
          return (
            <div
              key={i}
              className="absolute inset-0 flex flex-col justify-center items-center gap-5 px-4 text-center"
              style={{
                // slide in/out with translateX, fade non-adjacent
                transform: `translateX(${offset * 100}%)`,
                opacity: i === slide ? 1 : 0,
                transition: 'transform 0.45s cubic-bezier(0.4,0,0.2,1), opacity 0.35s ease',
                pointerEvents: i === slide ? 'auto' : 'none',
                // don't render invisible slides at all for perf
                visibility: visible ? 'visible' : 'hidden',
              }}
            >
              {/* Icon + decorative number */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div
                    className="absolute inset-0 rounded-2xl animate-glow-pulse"
                    style={{ background: step.grad, filter: 'blur(14px)', opacity: 0.5 }}
                  />
                  <div
                    className="relative w-16 h-16 rounded-2xl flex items-center justify-center text-4xl"
                    style={{ background: step.grad, boxShadow: '0 6px 20px rgba(0,0,0,0.4)' }}
                  >
                    {step.icon}
                  </div>
                </div>
                <span
                  className="font-display font-black text-6xl select-none leading-none"
                  style={{
                    background: step.grad,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    opacity: 0.22,
                  }}
                >
                  {step.num}
                </span>
              </div>

              {/* Title + description */}
              <div>
                <div
                  className="font-display font-black text-xl mb-2"
                  style={{
                    background: step.grad,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {t(step.tk)}
                </div>
                <p className="font-body text-sm leading-relaxed" style={{ color: C.muted, maxWidth: 260, margin: '0 auto' }}>
                  {t(step.dk)}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Dots + nav */}
      <div className="flex items-center justify-between mt-5">
        <button
          onClick={() => setSlide(s => Math.max(s - 1, 0))}
          disabled={slide === 0}
          className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-lg transition-all hover:scale-110 active:scale-90 disabled:opacity-25"
          style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)' }}
        >◀</button>

        <div className="flex gap-2 items-center">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === slide ? 24 : 8,
                height: 8,
                background: i === slide ? steps[i].grad : 'rgba(255,255,255,0.2)',
              }}
            />
          ))}
        </div>

        <button
          onClick={() => setSlide(s => Math.min(s + 1, n - 1))}
          disabled={slide === n - 1}
          className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-lg transition-all hover:scale-110 active:scale-90 disabled:opacity-25"
          style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)' }}
        >▶</button>
      </div>
    </div>
  )
}

// ── Home ──────────────────────────────────────────────────────────────────────
export default function Home() {
  const navigate = useNavigate()
  const toast    = useToast()
  const { t }    = useLang()

  const [nickname,    setNickname]    = useLocalStorage('ff_nickname', '')
  const [avatarIdx,   setAvatarIdx]   = useLocalStorage('ff_avatar', 0)
  const [intervalSec, setIntervalSec] = useState(60)
  const [joinCode,    setJoinCode]    = useState('')
  const [tab,         setTab]         = useState('create')
  const [loading,     setLoading]     = useState(false)
  const [linkCopied,  setLinkCopied]  = useState(false)

  useSocket({
    [E.ROOM_CREATED]: (r) => { setLoading(false); navigate(`/lobby/${r.code}`) },
    [E.JOINED_ROOM]:  (r) => {
      setLoading(false)
      navigate(r.status === 'writing' || r.status === 'voting' ? `/game/${r.code}` : `/lobby/${r.code}`)
    },
    [E.GAME_ERROR]: ({ message }) => { setLoading(false); toast(message, 'error') },
  })

  function handleCreate() {
    if (!nickname.trim()) { toast(t('errNick'), 'error'); return }
    setLoading(true)
    createRoom({ creator: nickname.trim(), avatarIdx, intervalSec, voteSec: 30 })
  }
  function handleJoin() {
    if (!nickname.trim()) { toast(t('errNick'), 'error'); return }
    if (!joinCode.trim()) { toast(t('errCode'), 'error'); return }
    setLoading(true)
    joinRoom({ roomCode: joinCode.trim().toUpperCase(), nickname: nickname.trim(), avatarIdx })
  }
  function handleCopyLink() {
    if (!joinCode.trim()) return
    navigator.clipboard
      .writeText(`${window.location.origin}/lobby/${joinCode.trim().toUpperCase()}`)
      .then(() => { setLinkCopied(true); setTimeout(() => setLinkCopied(false), 2000) })
      .catch(() => {})
  }

  return (
    <GameLayout>
      <div className="w-full max-w-[880px] flex flex-col lg:flex-row gap-10 lg:gap-16 items-center lg:items-start animate-slide-up">

        {/* ══ LEFT: form ══ */}
        <div className="flex-1 flex flex-col gap-6 min-w-0 w-full max-w-md lg:max-w-none">

          {/* Desktop title only */}
          <div className="hidden lg:block">
            <h1 className="font-display font-black text-5xl text-shadow leading-tight">
              <span style={{ color: '#fff' }}>FACTOR</span>
              <span className="text-gradient-gold">FICTION</span>
            </h1>
            <p className="font-display font-black text-sm tracking-widest mt-1" style={{ color: C.muted }}>
              {t('tagline').toUpperCase()}
            </p>
          </div>

          {/* Avatar + nick */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <AvatarOrb idx={avatarIdx} onChange={setAvatarIdx} t={t} />
            <div className="flex-1 w-full flex flex-col gap-2">
              <label
                className="font-display font-black text-xs tracking-widest uppercase text-center sm:text-left"
                style={{ color: C.dim }}
              >
                {t('nickname')}
              </label>
              <input
                className="inp text-lg text-center sm:text-left"
                placeholder={t('enterNick')}
                value={nickname}
                maxLength={20}
                onChange={e => setNickname(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (tab === 'create' ? handleCreate() : handleJoin())}
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="relative flex p-1 rounded-2xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div
              className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-xl transition-all duration-200"
              style={{
                left: tab === 'create' ? '4px' : 'calc(50%)',
                background: `linear-gradient(135deg,${C.purple},${C.purpleD})`,
                boxShadow: `0 2px 20px ${C.purple}66`,
              }}
            />
            {[['create', `🎮 ${t('create')}`], ['join', `🚪 ${t('join')}`]].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className="relative flex-1 py-2.5 rounded-xl font-display font-black text-sm transition-colors duration-200"
                style={{ color: tab === key ? '#fff' : C.muted, zIndex: 1 }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* CREATE */}
          {tab === 'create' && (
            <div className="flex flex-col gap-5 animate-slide-down">
              <div>
                <label
                  className="font-display font-black text-xs tracking-widest uppercase mb-3 block"
                  style={{ color: C.dim }}
                >
                  {t('writeTime')}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {WRITE_TIMES.map(({ sec, key }) => (
                    <button
                      key={sec}
                      onClick={() => setIntervalSec(sec)}
                      className="py-3 rounded-2xl font-display font-black text-sm transition-all hover:scale-105 active:scale-95"
                      style={
                        intervalSec === sec
                          ? {
                              background: `linear-gradient(135deg,${C.yellowL},${C.orange})`,
                              color: '#1a0848',
                              boxShadow: `0 4px 20px ${C.yellow}55`,
                            }
                          : { background: 'rgba(255,255,255,0.06)', color: C.muted }
                      }
                    >
                      {t(key)}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={handleCreate} disabled={loading} className="btn-green w-full py-4 text-xl rounded-2xl">
                {loading
                  ? <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  : `▶ ${t('createRoom')}`}
              </button>
            </div>
          )}

          {/* JOIN */}
          {tab === 'join' && (
            <div className="flex flex-col gap-5 animate-slide-down">
              <div>
                <label
                  className="font-display font-black text-xs tracking-widest uppercase mb-3 block"
                  style={{ color: C.dim }}
                >
                  {t('roomCode')}
                </label>
                <CodeLetters value={joinCode} />
                <input
                  className="inp mt-3 text-center text-2xl font-mono tracking-[0.5em] uppercase"
                  placeholder={t('enterCode')}
                  value={joinCode}
                  maxLength={6}
                  onChange={e => setJoinCode(e.target.value.toUpperCase())}
                  onKeyDown={e => e.key === 'Enter' && handleJoin()}
                />
              </div>
              <button onClick={handleJoin} disabled={loading} className="btn-pink w-full py-4 text-xl rounded-2xl">
                {loading
                  ? <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  : `→ ${t('joinRoom')}`}
              </button>
              {joinCode.length === 6 && (
                <button onClick={handleCopyLink} className="btn-ghost w-full py-3 text-sm rounded-xl">
                  {linkCopied ? t('copied') : `🔗 ${t('shareLink')}`}
                </button>
              )}
            </div>
          )}
        </div>

        {/* ══ RIGHT: swiper ══ */}
        <div className="w-full lg:w-[280px] xl:w-[300px] shrink-0">
          <HowToSwiper t={t} />
        </div>

      </div>
    </GameLayout>
  )
}
