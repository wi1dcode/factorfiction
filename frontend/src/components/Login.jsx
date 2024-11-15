import React, { useState, useRef, useContext } from "react"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react"
import ProfileSVG from "../assets/svg/ProfileSVG"
import LockSVG from "../assets/svg/LockSVG"
import UserContext from "../services/userContext"
import { login, register } from "../api/session"

export default function AuthModal({ isOpen, onOpenChange }) {
  const { setConnected, setToken } = useContext(UserContext)
  const [isRegister, setIsRegister] = useState(false) // Состояние для переключения между логином и регистрацией
  const [error, setError] = useState("")
  const userAuth = useRef({
    username: "",
    password: "",
  })

  const handleAuth = async () => {
    try {
      let res
      if (isRegister) {
        res = await register(userAuth.current)
      } else {
        res = await login(userAuth.current)
      }
      localStorage.setItem("token", res.token)
      setToken(res.token)
      setConnected(true)
      onOpenChange(false) // Закрываем модальное окно после успешного входа или регистрации
    } catch (error) {
      setError(
        error.response?.status === 400
          ? "Ошибка: " + error.response.data.message
          : "Ошибка сервера. Попробуйте позже."
      )
      setTimeout(() => {
        setError("")
      }, 3000)
    }
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="auto"
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex justify-center w-full mb-4">
                  <div className="flex bg-gray-200 p-1 rounded-full w-64">
                    <button
                      className={`w-1/2 p-2 rounded-full transition-colors ${
                        !isRegister ? "bg-white" : ""
                      }`}
                      onClick={() => setIsRegister(false)}
                    >
                      Log in
                    </button>
                    <button
                      className={`w-1/2 p-2 rounded-full transition-colors ${
                        isRegister ? "bg-white" : ""
                      }`}
                      onClick={() => setIsRegister(true)}
                    >
                      Register
                    </button>
                  </div>
                </div>
              </ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  endContent={
                    <ProfileSVG className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  }
                  placeholder="Username"
                  variant="bordered"
                  onChange={(e) => (userAuth.current.username = e.target.value)}
                />
                <Input
                  endContent={
                    <LockSVG className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  }
                  placeholder="Password"
                  type="password"
                  variant="bordered"
                  onChange={(e) => (userAuth.current.password = e.target.value)}
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={handleAuth}>
                  {isRegister ? "Register" : "Login"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
