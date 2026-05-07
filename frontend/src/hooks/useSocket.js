import { useEffect } from 'react'
import { on } from '../services/socket'

/**
 * Subscribe to multiple socket events, auto-cleanup on unmount.
 * Usage: useSocket({ eventName: handler, ... })
 */
export function useSocket(handlers) {
  useEffect(() => {
    const cleanups = Object.entries(handlers).map(([event, cb]) => on(event, cb))
    return () => cleanups.forEach(fn => fn())
  }, []) // eslint-disable-line
}
