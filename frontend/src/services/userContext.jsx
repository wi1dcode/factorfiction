import { createContext, useEffect, useMemo, useState } from "react"
import { validateToken, getMe } from "../api/session"

const UserContext = createContext()

export function UserContextProvider({ children }) {
  const [connected, setConnected] = useState(null)
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [token, setToken] = useState(localStorage.getItem("token"))
  const [isLoading, setIsLoading] = useState(true)

  const checkSession = async () => {
    setIsLoading(true)
    if (token) {
      try {
        const verifiedToken = await validateToken()
        if (verifiedToken) {
          setConnected(true)
          const userInfo = await getMe()
          setUser(userInfo)
          setIsAdmin(userInfo.role === "ADMIN")
          setIsLoading(false)
        } else {
          setConnected(false)
          setIsAdmin(false)
          setUser(null)
          setToken(null)
          setIsLoading(false)
        }

        const now = new Date().getTime()
        const expToken = verifiedToken.exp * 1000

        if (now > expToken) {
          localStorage.removeItem("token")
          setConnected(false)
          setIsAdmin(false)
          setUser(null)
          setToken(null)
          setIsLoading(false)
        }
      } catch (error) {
        localStorage.removeItem("token")
        setConnected(false)
        setIsAdmin(false)
        setUser(null)
        setToken(null)
        setIsLoading(false)
      }
    } else {
      setIsAdmin(false)
      setConnected(false)
      setToken(null)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkSession()
  }, [token])

  const contextData = useMemo(
    () => ({
      connected,
      setConnected,
      token,
      setToken,
      user,
      setUser,
      isAdmin,
      isLoading,
      checkSession,
    }),
    [connected, token, setConnected, user, setUser, isAdmin, isLoading]
  )

  return (
    <UserContext.Provider value={contextData}>{children}</UserContext.Provider>
  )
}

export default UserContext
