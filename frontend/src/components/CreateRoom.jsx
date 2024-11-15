import { Button, Input, Switch, Tabs, Tab } from "@nextui-org/react"
import React, { useState } from "react"
import LockClosed from "../assets/svg/LockClosed"
import LockOpen from "../assets/svg/LockOpen"
import { socket } from "../services/socket"
import { useNavigate } from "react-router-dom"

function CreateRoom({ handleCreateRoom }) {
  const navigate = useNavigate()
  const [nickname, setNickname] = useState("")
  const [roomTitle, setRoomTitle] = useState("")
  const [isPasswordProtected, setIsPasswordProtected] = useState(false)
  const [password, setPassword] = useState("")
  const [selectedInterval, setSelectedInterval] = useState("1m")

  const intervals = [
    { key: "15s", label: "15 секунд", color: "red" },
    { key: "30s", label: "30 секунд", color: "orange" },
    { key: "1m", label: "1 минута", color: "blue" },
    { key: "2m", label: "2 минуты", color: "green" },
    { key: "3m", label: "3 минуты", color: "blue" },
    { key: "5m", label: "5 минут", color: "purple" },
  ]

  const handleRoomCreation = () => {
    if (!nickname || !roomTitle) {
      alert("Введите никнейм и название комнаты!")
      return
    }

    localStorage.setItem("nickname", nickname)

    socket.emit("createRoom", {
      title: roomTitle,
      creator: nickname,
      interval: selectedInterval,
    })

    socket.on("roomCreated", (room) => {
      navigate(`/lobby/${room.code}`)
    })

    socket.on("error", (error) => {
      alert(error.message)
    })
  }

  return (
    <div className="relative mx-auto w-full rounded-lg p-4 flex flex-col items-center shadow-md">
      <h2 className="text-xl font-bold mb-4">Создание комнаты</h2>
      <div className="flex gap-x-4 w-2/3">
        {/* Никнейм */}
        <Input
          fullWidth
          clearable
          label="Никнейм"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="mb-4"
          classNames={{
            label: "text-black/50 dark:text-white/90",
            input: [
              "bg-transparent",
              "text-black/90 dark:text-white/90",
              "placeholder:text-default-700/50 dark:placeholder:text-white/60",
            ],
            innerWrapper: "bg-transparent",
            inputWrapper: [
              "shadow-xl",
              "bg-default-200/50",
              "dark:bg-default/60",
              "backdrop-blur-xl",
              "backdrop-saturate-200",
              "hover:bg-default-200/70",
              "dark:hover:bg-default/70",
              "group-data-[focus=true]:bg-default-200/50",
              "dark:group-data-[focus=true]:bg-default/60",
              "!cursor-text",
            ],
          }}
        />

        {/* Название комнаты */}
        <Input
          fullWidth
          clearable
          label="Название комнаты"
          value={roomTitle}
          onChange={(e) => setRoomTitle(e.target.value)}
          className="mb-4"
          classNames={{
            label: "text-black/50 dark:text-white/90",
            input: [
              "bg-transparent",
              "text-black/90 dark:text-white/90",
              "placeholder:text-default-700/50 dark:placeholder:text-white/60",
            ],
            innerWrapper: "bg-transparent",
            inputWrapper: [
              "shadow-xl",
              "bg-default-200/50",
              "dark:bg-default/60",
              "backdrop-blur-xl",
              "backdrop-saturate-200",
              "hover:bg-default-200/70",
              "dark:hover:bg-default/70",
              "group-data-[focus=true]:bg-default-200/50",
              "dark:group-data-[focus=true]:bg-default/60",
              "!cursor-text",
            ],
          }}
        />
      </div>

      <div className="flex flex-col items-center w-full gap-y-4">
        {/* Выбор интервала */}
        <div className="flex items-center">
          <Tabs
            color="primary"
            aria-label="Выбор интервала"
            selectionMode="single"
            selectedKey={selectedInterval}
            onSelectionChange={(key) => setSelectedInterval(key)}
            radius="full"
          >
            {intervals.map((interval) => (
              <Tab
                key={interval.key}
                title={interval.label}
                style={{
                  color: interval.color,
                  borderBottomColor: interval.color,
                }}
              />
            ))}
          </Tabs>
        </div>

        {/* Парольная защита */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Switch
              size="lg"
              color="danger"
              isSelected={isPasswordProtected}
              onChange={(e) => setIsPasswordProtected(e.target.checked)}
              thumbIcon={({ isSelected, className }) =>
                isSelected ? (
                  <LockClosed className={className} />
                ) : (
                  <LockOpen className={className} />
                )
              }
            />
          </div>

          {/* Поле для ввода пароля, отображается только если пароль включен */}
          {isPasswordProtected && (
            <div className="w-full">
              <Input
                fullWidth
                clearable
                label="Пароль"
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Кнопка создания комнаты */}
      <Button
        className="text-lg font-bold bg-indigo-500/50 mt-4"
        onClick={handleRoomCreation}
      >
        Создать комнату
      </Button>
    </div>
  )
}

export default CreateRoom
