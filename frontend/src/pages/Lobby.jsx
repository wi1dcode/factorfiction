import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react"
import { socket } from "../services/socket"

export default function Lobby() {
  const { code } = useParams() // Код комнаты из URL
  const [players, setPlayers] = useState([]) // Список игроков в лобби
  const [nickname, setNickname] = useState(
    localStorage.getItem("nickname") || ""
  ) // Никнейм из localStorage
  const [newNickname, setNewNickname] = useState("") // Временный никнейм для модального окна
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const joinRoom = (nick) => {
    socket.emit("joinRoom", { roomCode: code, nickname: nick })

    socket.on("joinedRoom", ({ players }) => {
      setPlayers(players) // Обновляем список игроков
      onOpenChange(false) // Закрываем модальное окно
    })

    socket.on("playerJoined", ({ players }) => {
      setPlayers(players) // Обновляем список игроков
    })

    socket.on("playerDisconnected", ({ players }) => {
      setPlayers(players) // Обновляем список игроков
    })

    socket.on("error", (error) => {
      console.error(error.message) // Логируем ошибку
    })
  }

  useEffect(() => {
    if (!nickname) {
      onOpen() // Открываем модальное окно, если никнейм отсутствует
    } else {
      joinRoom(nickname) // Подключаемся к комнате
    }

    return () => {
      // Удаляем обработчики событий при размонтировании компонента
      socket.off("joinedRoom")
      socket.off("playerJoined")
      socket.off("playerDisconnected")
      socket.off("error")
    }
  }, [nickname, code])

  const handleJoinClick = () => {
    const trimmedNickname = newNickname.trim()
    if (!trimmedNickname) {
      alert("Никнейм обязателен")
      return
    }

    localStorage.setItem("nickname", trimmedNickname)
    setNickname(trimmedNickname) // Обновляем состояние
    joinRoom(trimmedNickname) // Подключаемся к комнате
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold">Лобби комнаты {code}</h1>
      <h2>Игроки:</h2>
      <ul>
        {players.map((player, index) => (
          <li key={index}>
            {player.nickname} - {player.status === "connected" ? "🟢" : "🔴"}
          </li>
        ))}
      </ul>

      <Modal
        isOpen={isOpen}
        placement="auto"
        onOpenChange={onOpenChange}
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Введите ваш никнейм</ModalHeader>
              <ModalBody>
                <Input
                  fullWidth
                  clearable
                  label="Никнейм"
                  placeholder="Введите ваш никнейм"
                  value={newNickname}
                  onChange={(e) => setNewNickname(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button onClick={handleJoinClick}>Войти</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}
