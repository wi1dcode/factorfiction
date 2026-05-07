import { useState, useEffect, useRef } from 'react'

export function useTimer(totalSec, active, onEnd) {
  const [left, setLeft] = useState(totalSec)
  const intervalRef = useRef(null)
  const firedRef    = useRef(false)

  useEffect(() => {
    setLeft(totalSec)
    firedRef.current = false
  }, [totalSec])

  useEffect(() => {
    clearInterval(intervalRef.current)
    if (!active || left <= 0) return

    intervalRef.current = setInterval(() => {
      setLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current)
          if (!firedRef.current) { firedRef.current = true; onEnd?.() }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(intervalRef.current)
  }, [active])

  const pct = Math.max(0, Math.min(100, (left / totalSec) * 100))
  const isUrgent = pct < 25

  return { left, pct, isUrgent }
}
