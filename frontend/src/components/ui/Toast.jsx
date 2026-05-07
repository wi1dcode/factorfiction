import React, { useState, createContext, useContext, useCallback } from 'react'
import { C } from '../../utils/constants'

const Ctx = createContext(null)

const KINDS = {
  success: { grad: `linear-gradient(135deg,${C.greenL},#059669)`, icon: '✓', label: 'ГОТОВО'  },
  error:   { grad: `linear-gradient(135deg,${C.red},#B91C1C)`,    icon: '✕', label: 'ОШИБКА'  },
  info:    { grad: `linear-gradient(135deg,${C.purple},${C.purpleD})`, icon: 'ℹ', label: 'ИНФО' },
  warn:    { grad: `linear-gradient(135deg,${C.orange},${C.yellow})`, icon: '⚠', label: 'ВНИМАНИЕ' },
}

function ToastItem({ message, type = 'error' }) {
  const k = KINDS[type] || KINDS.error
  return (
    <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl animate-scale-in"
      style={{
        background: k.grad,
        boxShadow: '0 4px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.15) inset, 0 1px 0 rgba(255,255,255,0.25) inset',
        minWidth: 260, maxWidth: 360,
      }}>
      <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-black text-white flex-shrink-0">
        {k.icon}
      </div>
      <div>
        <div className="font-display font-black text-xs tracking-wider text-white/75 uppercase">{k.label}</div>
        <div className="font-display font-bold text-sm text-white mt-0.5">{message}</div>
      </div>
    </div>
  )
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const show = useCallback((message, type = 'error') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500)
  }, [])

  return (
    <Ctx.Provider value={show}>
      {children}
      <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center pointer-events-none w-full max-w-sm px-4">
        {toasts.map(t => <ToastItem key={t.id} message={t.message} type={t.type} />)}
      </div>
    </Ctx.Provider>
  )
}

export function useToast() { return useContext(Ctx) }
