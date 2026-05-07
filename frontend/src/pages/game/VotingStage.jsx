import React from 'react'
import TimerBar from '../../components/ui/TimerBar'
import RoundBadge from '../../components/game/RoundBadge'
import { useLang } from '../../hooks/useLang'
import { useTimer } from '../../hooks/useTimer'
import { AVATARS, C } from '../../utils/constants'

function VoteTile({ story, idx, chosen, disabled, voteCount, onVote }) {
  return (
    <button onClick={() => onVote(story.id)} disabled={disabled}
      className="w-full text-left flex items-start gap-3 p-4 rounded-2xl transition-all duration-200"
      style={chosen ? {
        background: `rgba(253,224,71,0.12)`,
        boxShadow: `0 0 24px rgba(253,224,71,0.4), 0 0 0 1px rgba(253,224,71,0.4)`,
        transform: 'scale(1.01)',
      } : disabled ? {
        background: 'rgba(255,255,255,0.03)',
        opacity: 0.35,
        cursor: 'not-allowed',
      } : {
        background: 'rgba(255,255,255,0.05)',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.07)',
        cursor: 'pointer',
      }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center font-display font-black text-sm flex-shrink-0 mt-0.5"
        style={chosen
          ? { background: C.yellowL, color: '#1a0848' }
          : { background: `${C.purple}44`, boxShadow: `0 0 0 1px ${C.purple}55`, color: '#fff' }}>
        {chosen ? '✓' : idx + 1}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-display font-bold text-sm leading-relaxed" style={{ color: '#fff' }}>{story.text}</p>
        {voteCount > 0 && (
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="font-mono font-bold text-xs" style={{ color: C.yellowL }}>🗳 {voteCount}</span>
            <span className="font-display text-xs" style={{ color: C.dim }}>
              {voteCount === 1 ? 'голос' : voteCount < 5 ? 'голоса' : 'голосов'}
            </span>
          </div>
        )}
      </div>
      {chosen && <span className="text-xl flex-shrink-0 mt-1" style={{ color: C.yellowL }}>✓</span>}
    </button>
  )
}

export default function VotingStage({ nickname, currentRound, votes, myVote, voteSec, onVote }) {
  const { t } = useLang()
  const isAuthor = currentRound.author === nickname
  const { left, isUrgent } = useTimer(voteSec, !myVote && !isAuthor, null)
  const authorAv = AVATARS[currentRound.roundIndex % AVATARS.length]

  return (
    <div className="w-full max-w-lg flex flex-col gap-6 animate-slide-up">

      <div className="flex items-center justify-between">
        <RoundBadge index={currentRound.roundIndex} total={currentRound.totalRounds} />
        {isUrgent && <span className="font-display font-black text-xs animate-pulse" style={{ color: C.red }}>⚡ {t('voteUrgent')}</span>}
      </div>

      {/* Author */}
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="relative">
          <div className="absolute inset-0 rounded-full animate-glow-pulse"
            style={{ background: `${authorAv.color}44`, transform: 'scale(1.5)', filter: 'blur(16px)' }} />
          <div className="relative w-20 h-20 rounded-full flex items-center justify-center"
            style={{
              background: `radial-gradient(circle at 35% 30%, ${authorAv.color}, ${authorAv.color}99)`,
              border: `4px solid ${authorAv.color}88`,
              boxShadow: `0 8px 24px ${authorAv.color}55`,
            }}>
            <span className="text-4xl" style={{ filter: 'drop-shadow(0 3px 4px rgba(0,0,0,0.5))' }}>{authorAv.emoji}</span>
            <div className="absolute top-[14%] left-[20%] w-[28%] h-[17%] bg-white/30 rounded-full blur-sm pointer-events-none" style={{ transform: 'rotate(-25deg)' }} />
          </div>
        </div>
        <p className="font-display font-black text-lg text-shadow">{t('storiesOf')}</p>
        <p className="font-display font-black text-2xl text-shadow" style={{ color: C.yellowL }}>{currentRound.author}</p>
      </div>

      {/* Timer — no wrapper */}
      <TimerBar left={left} total={voteSec} label={t('voteTime')} />

      {/* Content */}
      {isAuthor ? (
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <div className="text-6xl animate-pulse-soft">👀</div>
          <div className="font-display font-black text-lg">{t('yourStories')}</div>
          <p className="font-body text-sm" style={{ color: C.muted }}>{t('watchOthers')}</p>
          {votes.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              {votes.map(v => (
                <span key={v.voter} className="pill animate-scale-in"
                  style={{ background: `${C.green}22`, color: C.greenL, boxShadow: `0 0 0 1px ${C.green}44` }}>
                  ✓ {v.voter}
                </span>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <p className="font-body text-sm text-center" style={{ color: C.muted }}>
            Какая история — <span className="font-black" style={{ color: C.greenL }}>правда</span>?
          </p>
          {currentRound.stories.map((s, idx) => (
            <VoteTile key={s.id} story={s} idx={idx}
              chosen={myVote === s.id} disabled={!!myVote && myVote !== s.id}
              voteCount={votes.filter(v => v.storyId === s.id).length} onVote={onVote} />
          ))}
          {votes.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center pt-1">
              <span className="font-display font-black text-xs tracking-wider uppercase" style={{ color: C.dim }}>{t('voted')}:</span>
              {votes.map(v => (
                <span key={v.voter} className="pill animate-scale-in text-xs"
                  style={{ background: `${C.purple}25`, boxShadow: `0 0 0 1px ${C.purple}44`, color: '#d8b4fe' }}>
                  {v.voter}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
