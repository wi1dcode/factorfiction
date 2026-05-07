import React, { createContext, useContext, useState, useCallback } from "react"
import T from "../utils/i18n"

const Ctx = createContext(null)

export function LangProvider({ children }) {
  const [lang, setLang] = useState(
    () => localStorage.getItem("ff_lang") || "ru",
  )

  const changeLang = useCallback((code) => {
    setLang(code)
    localStorage.setItem("ff_lang", code)
  }, [])

  const t = useCallback(
    (key) => {
      return T[lang]?.[key] ?? T["ru"]?.[key] ?? key
    },
    [lang],
  )

  return <Ctx.Provider value={{ lang, changeLang, t }}>{children}</Ctx.Provider>
}

export function useLang() {
  return useContext(Ctx)
}
