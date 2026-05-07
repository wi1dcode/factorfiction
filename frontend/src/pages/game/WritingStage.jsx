import React, { useState } from 'react'
import TimerBar from '../../components/ui/TimerBar'
import { useLang } from '../../hooks/useLang'
import { useTimer } from '../../hooks/useTimer'
import { C } from '../../utils/constants'

export default function WritingStage({ nickname, intervalSec, submitted, submitInfo, onSubmit }) {
  const [truth, setTruth] = useState('')
  const [lie,   setLie]   = useState('')
  const [error, setError] = useState('')
  const { t } = useLang()

  const { left, isUrgent } = useTimer(intervalSec, !submitted, () => {
    if (!submitted && truth.trim() && lie.trim()) onSubmit(truth.trim(), lie.trim())
  })

  function handleSubmit() {
    if (!truth.trim() || !lie.trim()) { setError(t('errBothFields')); return }
    setError('')
    onSubmit(truth.trim(), lie.trim())
  }

  return (
    <div className="w-full max-w-lg flex flex-col gap-7 animate-slide-up">

      {/* Header */}
      <div className="text-center">
        <div className="text-6xl mb-3 animate-float">✍️</div>
        <h2 className="font-display font-black text-3xl text-shadow">{t('writingPhase')}</h2>
        <p className="font-body text-sm mt-1.5" style={{ color: C.muted }}>
          {t('hiNick')} <span className="font-black" style={{ color: C.yellowL }}>{nickname}</span>!
        </p>
      </div>

      {/* Timer — no card wrapper */}
      <TimerBar left={left} total={intervalSec} label={isUrgent ? t('hurry') : t('timeLeft')} />

      {!submitted ? (
        <div className="flex flex-col gap-5">
          <p className="font-body text-sm text-center leading-relaxed" style={{ color: C.muted }}>
            Напиши одну <span className="font-black" style={{ color: C.greenL }}>правду</span> и одну{' '}
            <span className="font-black" style={{ color: C.red }}>ложь</span> о себе
          </p>

          {error && (
            <div className="px-4 py-3 rounded-2xl font-display font-black text-sm text-center animate-shake"
              style={{ background: `${C.red}18`, boxShadow: `0 0 0 1px ${C.red}44`, color: '#fca5a5' }}>
              {error}
            </div>
          )}

          <div>
            <label className="font-display font-black text-xs tracking-wider uppercase mb-2 block" style={{ color: C.greenL }}>
              {t('truthLabel')}
            </label>
            <textarea className="inp resize-none" rows={3} placeholder={t('truthPlaceholder')} value={truth}
              style={{ boxShadow: truth ? `0 0 0 1px ${C.greenL}44, inset 0 2px 8px rgba(0,0,0,0.3)` : undefined }}
              onChange={e => { setTruth(e.target.value); setError('') }} />
          </div>

          <div>
            <label className="font-display font-black text-xs tracking-wider uppercase mb-2 block" style={{ color: C.red }}>
              {t('lieLabel')}
            </label>
            <textarea className="inp resize-none" rows={3} placeholder={t('liePlaceholder')} value={lie}
              style={{ boxShadow: lie ? `0 0 0 1px ${C.red}44, inset 0 2px 8px rgba(0,0,0,0.3)` : undefined }}
              onChange={e => { setLie(e.target.value); setError('') }} />
          </div>

          <button onClick={handleSubmit} disabled={!truth.trim() || !lie.trim()} className="btn-green w-full py-4 text-xl rounded-2xl">
            {t('ready2')}
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-5 text-center py-4">
          <div className="text-6xl animate-scale-in">⏳</div>
          <div className="font-display font-black text-xl">{t('storiesSent')}</div>
          <p style={{ color: C.muted }} className="font-body text-sm">{t('waitOthers')}</p>
          {submitInfo && (
            <>
              <div className="flex gap-3">
                {Array.from({ length: submitInfo.total }).map((_, i) => (
                  <div key={i} className="w-5 h-5 rounded-full transition-all duration-500"
                    style={{
                      background: i < submitInfo.submitted ? C.greenL : 'rgba(255,255,255,0.12)',
                      boxShadow: i < submitInfo.submitted ? `0 0 12px ${C.green}` : 'none',
                      transform: i < submitInfo.submitted ? 'scale(1.3)' : 'scale(1)',
                    }} />
                ))}
              </div>
              <div className="font-mono font-bold text-lg" style={{ color: C.yellowL }}>
                {submitInfo.submitted} / {submitInfo.total}
              </div>
            </>
          )}
          <div className="w-full mt-2">
            <TimerBar left={left} total={intervalSec} />
          </div>
        </div>
      )}
    </div>
  )
}
