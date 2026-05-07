import React from 'react'
import { useNavigate } from 'react-router-dom'
import GameLayout from '../components/layout/GameLayout'
import { useLang } from '../hooks/useLang'
import { PALETTE as p } from '../utils/constants'

export default function NotFound() {
  const navigate = useNavigate()
  const { t } = useLang()
  return (
    <GameLayout>
      <div className="flex flex-col items-center gap-6 text-center animate-slide-up">
        <div className="text-8xl animate-float">🤷</div>
        <div>
          <h1 className="font-display font-black text-5xl text-shadow" style={{ color: p.accent }}>404</h1>
          <p className="font-display font-black text-xl mt-2">СТРАНИЦА НЕ НАЙДЕНА</p>
          <p className="font-body text-sm mt-2" style={{ color: p.dim }}>Это не правда и не ложь — просто ошибка.</p>
        </div>
        <button onClick={() => navigate('/')} className="btn-primary px-8 py-4 text-lg rounded-btn gap-2">
          🏠 На главную
        </button>
      </div>
    </GameLayout>
  )
}
