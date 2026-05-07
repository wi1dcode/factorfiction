// Button — thin wrapper using CSS classes from index.css
// Prefer using .btn-* classes directly in JSX for performance.
// This component is for cases where you need programmatic variant selection.
import React from 'react'

const VARIANTS = {
  primary: 'btn-primary',
  success: 'btn-success',
  danger:  'btn-danger',
  accent:  'btn-accent',
  pink:    'btn-pink',
  ghost:   'btn-ghost',
}

export default function Button({
  children, onClick, disabled, loading,
  variant = 'primary', size = 'md',
  className = '', fullWidth, icon,
}) {
  const sizeClass = { sm: 'px-4 py-2 text-sm', md: 'px-6 py-3 text-base', lg: 'px-8 py-4 text-lg' }[size] ?? 'px-6 py-3'

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={[VARIANTS[variant] ?? 'btn-primary', sizeClass, 'rounded-btn', fullWidth ? 'w-full' : '', className].filter(Boolean).join(' ')}
    >
      {loading
        ? <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
        : icon && <span className="text-lg">{icon}</span>
      }
      {!loading && children}
    </button>
  )
}
