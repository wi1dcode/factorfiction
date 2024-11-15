import { useState, useEffect, useContext } from "react"
// import { socket } from "../services/socket"
import { Link, useNavigate } from "react-router-dom"
import { Button, Input, useDisclosure } from "@nextui-org/react"
import UserContext from "../services/userContext"
import Container from "../components/Container"
import Header from "../components/Header"
import Footer from "../components/Footer"
import KeySVG from "../assets/svg/KeySVG"
import Login from "../components/Login"
import LangModal from "../components/LangModal"
import JoinRoom from "../components/JoinRoom"
import OpenRoom from "../components/OpenRoom"
import OpenRoomsHeader from "../components/OpenRoomsHeader"

function Home() {
  const navigate = useNavigate()
  const loginModal = useDisclosure()
  const langModal = useDisclosure()
  const { user, connected } = useContext(UserContext)
  const [nickname, setNickname] = useState("")
  const [roomCode, setRoomCode] = useState("")
  const [roomTitle, setRoomTitle] = useState("")
  const [author, setAuthor] = useState("") // Временный ID пользователя для тестирования

  // useEffect(() => {
  //   // Обработка событий, отправляемых сервером
  //   socket.on("roomCreated", (room) => {
  //     console.log("Комната создана:", room)
  //     // Можно добавить редирект в комнату используя роутер или установить состояние
  //   })

  //   socket.on("playerJoined", (nickname) => {
  //     console.log("Игрок присоединился:", nickname)
  //     // Обновить состояние комнаты
  //   })

  //   socket.on("gameStarted", (room) => {
  //     console.log("Игра началась в комнате:", room)
  //     // Переход на экран игры
  //   })

  //   socket.on("error", (error) => {
  //     console.error("Ошибка:", error.message)
  //   })

  //   // Отписка от событий при размонтировании компонента
  //   return () => {
  //     socket.off("roomCreated")
  //     socket.off("playerJoined")
  //     socket.off("gameStarted")
  //     socket.off("error")
  //   }
  // }, [])

  const handleCreateRoom = () => {
    console.log(roomTitle + " + " + user.username)
    socket.emit("createRoom", {
      title: roomTitle,
      type: "open",
      maxPlayers: 5,
      author: user.username,
    })
  }

  const handleJoinRoom = () => {
    let nickname = connected ? user.username : nickname
    console.log(nickname + " " + roomCode)
    socket.emit("joinRoom", {
      roomCode: roomCode,
      nickname,
    })
  }

  const handleLoginClick = () => {
    if (connected) {
      navigate("/profile")
    } else {
      loginModal.onOpen()
    }
  }

  return (
    <div>
      <Container>
        <Login
          isOpen={loginModal.isOpen}
          onOpenChange={loginModal.onOpenChange}
        />
        <LangModal
          isOpen={langModal.isOpen}
          onOpenChange={langModal.onOpenChange}
        />
        <Header
          openLoginModal={handleLoginClick}
          openLangModal={langModal.onOpen}
        />
        <div className="mt-32 w-full flex gap-x-4 max-md:flex-col-reverse max-md:gap-y-4 h-[70%] max-md:h-auto">
          <div className="bg-black/10 backdrop-blur-sm rounded-lg p-2 w-1/2 max-md:w-full overflow-auto">
            <OpenRoomsHeader />
            <OpenRoom />
            <OpenRoom />
            <OpenRoom />
            <OpenRoom />
            <OpenRoom />
            <OpenRoom />
            <OpenRoom />
            <OpenRoom />
            <OpenRoom />
            <OpenRoom />
            <OpenRoom />
            <OpenRoom />
          </div>
          <div className="bg-black/10 backdrop-blur-sm rounded-lg p-2 w-1/2 max-md:w-full flex flex-col justify-between">
            <JoinRoom />
            <span className="block w-[75%] h-[3px] rounded-full mx-auto bg-gray-200/20" />
            To create room you need to login, it's very easy
          </div>
        </div>
        <Footer />
      </Container>
    </div>
  )
}

export default Home
