import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import UserContext from "../services/userContext"
import Container from "../components/Container"
import Header from "../components/Header"
import { Button, Input } from "@nextui-org/react"
import { changePassword, setSecretQuestion } from "../api/session"

function Profile() {
  const { user, setUser, setConnected, setToken } = useContext(UserContext)
  const navigate = useNavigate()
  const [secretQuestion, setSecretQuestionText] = useState("")
  const [secretAnswer, setSecretAnswerText] = useState("")
  const [isQuestionSet, setIsQuestionSet] = useState(null)
  const [message, setMessage] = useState("")

  const handleLogout = async () => {
    try {
      localStorage.removeItem("token")
      setUser(null)
      setToken(null)
      setConnected(false)
      navigate("/")
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  const handleSetSecretQuestion = async () => {
    if (!secretQuestion || !secretAnswer) {
      setMessage("Пожалуйста, заполните оба поля.")
      return
    }

    try {
      await setSecretQuestion(secretQuestion, secretAnswer)
      setIsQuestionSet(true)
      setMessage("Секретный вопрос успешно установлен.")
    } catch (error) {
      console.error("Error setting secret question:", error)
      setMessage("Произошла ошибка при установке секретного вопроса.")
    }
  }

  return (
    <div>
      <Container>
        <Header />
        <div className="mt-12 w-full max-md:h-auto text-center">
          <h1 className="text-3xl font-bold">Профиль</h1>
          <p className="text-lg mt-4">
            Вы вошли как: <strong>{user?.username}</strong>
          </p>
          <p className="text-lg">
            Роль: <strong>{user?.role}</strong>
          </p>

          <div className="mt-8">
            <Button color="error" onClick={handleLogout}>
              Выйти
            </Button>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-semibold">Секретный вопрос</h2>
            {isQuestionSet ? (
              <p className="text-green-500 mt-4">
                Секретный вопрос уже установлен.
              </p>
            ) : (
              <div className="mt-4">
                <Input
                  label="Секретный вопрос"
                  placeholder="Введите ваш секретный вопрос"
                  fullWidth
                  clearable
                  onChange={(e) => setSecretQuestionText(e.target.value)}
                />
                <Input
                  label="Ответ на секретный вопрос"
                  placeholder="Введите ответ на ваш вопрос"
                  fullWidth
                  clearable
                  className="mt-4"
                  onChange={(e) => setSecretAnswerText(e.target.value)}
                />
                <Button
                  color="primary"
                  className="mt-6"
                  onClick={handleSetSecretQuestion}
                >
                  Установить секретный вопрос
                </Button>
                {message && <p className="text-red-500 mt-2">{message}</p>}
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  )
}

export default Profile
