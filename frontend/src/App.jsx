import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LangProvider } from './hooks/useLang'
import { ToastProvider } from './components/ui/Toast'
import Home     from './pages/Home'
import Lobby    from './pages/Lobby'
import Game     from './pages/Game'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <LangProvider>
        <ToastProvider>
          <Routes>
            <Route path="/"            element={<Home />} />
            <Route path="/lobby/:code" element={<Lobby />} />
            <Route path="/game/:code"  element={<Game />} />
            <Route path="*"            element={<NotFound />} />
          </Routes>
        </ToastProvider>
      </LangProvider>
    </BrowserRouter>
  )
}
