import { useContext, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button, Input } from "@nextui-org/react"
import UserContext from "../services/userContext"
import { login } from "../api/session"

function Login() {
  const navigate = useNavigate()
  const userLogin = useRef({
    username: false,
    password: false,
  })
  const { connected, setConnected, setToken } = useContext(UserContext)
  const [redInput, setRedInput] = useState(false)

  useEffect(() => {
    if (connected) {
      navigate("/profile")
    }
  }, [connected, navigate])

  const logIn = async () => {
    try {
      const res = await login(userLogin.current)
      localStorage.setItem("token", res.token)
      setToken(res.token)
      setConnected(true)
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setRedInput(true)
        setTimeout(() => {
          setRedInput(false)
        }, 3000)
      }
    }
  }

  return (
    <section className="flex flex-col gap-y-4 justify-center items-center">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          logIn()
        }}
      >
        <div className="flex flex-col gap-y-4 mt-12">
          <Input
            label="username"
            size="sm"
            type="text"
            name="username"
            autoComplete="username"
            maxLength="50"
            className={` ${redInput && "border-red-400"}`}
            onChange={(e) => {
              userLogin.current = {
                ...userLogin.current,
                username: e.target.value,
              }
            }}
            required
          />
          <Input
            label="password"
            size="sm"
            type="password"
            name="password"
            maxLength="50"
            autoComplete="current-password"
            className={` ${redInput && "border-red-400"}`}
            onChange={(e) => {
              userLogin.current = {
                ...userLogin.current,
                password: e.target.value,
              }
            }}
            required
          />
        </div>
        <div className="text-center mt-4">
          <Button color="primary" type="submit">
            Login
          </Button>
        </div>
      </form>
    </section>
  )
}

export default Login
