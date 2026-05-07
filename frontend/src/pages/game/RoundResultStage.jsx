import React, { useState, useEffect } from 'react'
import RoundBadge from '../../components/game/RoundBadge'
import { useLang } from '../../hooks/useLang'
import { C } from '../../utils/constants'

function ResultCard({ story, idx, votes, delay }) {
  const [flipped, setFlipped] = useState(false)
  useEffect(() => {
    const h = setTimeout(() => setFlipped(true), delay)
    return () => clearTimeout(h)
  }, [delay])

  const color = story.truth ? C.greenL : C.red
  const colorDk = story.truth ? C.green : '#b91c1c'

  return (
    <div style={{ perspective: 1200 }}>
      <div className="w-full transition-all duration-700"
        style={{ transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(0deg)' : 'rotateY(-90deg)' }}>
        <div className="w-full p-4 rounded-2xl flex flex-col gap-3"
          style={{
            background: story.truth
              ? 'rgba(52,211,153,0.1)'
              : 'rgba(239,68,68,0.1)',
            boxShadow: `0 0 0 1px ${color}33, 0 0 24px ${color}22`,
          }}>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="pill font-black text-xs"
              style={{ background: `${color}25`, color, boxShadow: `0 0 0 1px ${color}44` }}>
              {story.truth ? '✓ ПРАВДА' : '✕ ЛОЖЬ'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {votes.filter(v => v.storyId === story.id).map(v => (
                <span key={v.voter} className="pill text-xs animate-scale-in"
                  style={v.correct
                    ? { background: `${C.green}18`, color: C.greenL, boxShadow: `0 0 0 1px ${C.green}33` }
                    : { background: `${C.red}18`,   color: C.red,    boxShadow: `0 0 0 1px ${C.red}33` }}>
                  {v.voter} {v.correct ? '✅' : '❌'}
                </span>
              ))}
            </div>
          </div>
          <p className="font-display font-bold text-sm leading-relaxed" style={{ color: '#fff' }}>
            {idx + 1}. {story.text}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function RoundResultStage({ roundResult, isCreator, onNext }) {
  const { t } = useLang()
  const isLast = roundResult.roundIndex + 1 >= roundResult.totalRounds

  return (
    <div className="w-full max-w-lg flex flex-col gap-6 animate-slide-up">
      <div className="flex justify-center">
        <RoundBadge index={roundResult.roundIndex} total={roundResult.totalRounds} />
      </div>

      <div className="text-center">
        <div className="text-5xl mb-2 animate-scale-in">📋</div>
        <h2 className="font-display font-black text-2xl text-shadow">{t('roundResult')}</h2>
        <p className="font-body text-sm mt-1" style={{ color: C.muted }}>
          {t('storiesOf2')} <span className="font-black" style={{ color: C.yellowL }}>{roundResult.author}</span>
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {roundResult.stories.map((s, i) => (
          <ResultCard key={s.id} story={s} idx={i} votes={roundResult.votes} delay={i * 350} />
        ))}
      </div>

      {isCreator ? (
        <button onClick={onNext}
          className={isLast ? 'btn-yellow w-full py-4 text-xl rounded-2xl' : 'btn-purple w-full py-4 text-xl rounded-2xl'}>
          {isLast ? t('finishGame') : t('nextRound')}
        </button>
      ) : (
        <div className="flex items-center justify-center gap-3 py-2">
          <span className="text-2xl animate-spin-slow">⏳</span>
          <span className="font-display font-black text-sm" style={{ color: C.muted }}>{t('waitCreator2')}</span>
        </div>
      )}
    </div>
  )
}
