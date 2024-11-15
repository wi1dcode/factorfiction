import React, { useState, useEffect } from "react"
import { useLocation, useParams } from "react-router-dom"

export default function Game() {
  const { code } = useParams()
  const location = useLocation()
  const [gameData, setGameData] = useState(location.state?.gameData || {})
  const [currentPlayer, setCurrentPlayer] = useState("")
  const [currentText, setCurrentText] = useState("")

  useEffect(() => {
    // Здесь можно установить логику получения данных об игре через сокеты
    if (!gameData) {
      alert("Данные игры отсутствуют")
    } else {
      setCurrentPlayer(gameData.players[0]) // Для теста устанавливаем первого игрока
      setCurrentText(`Это тестовая история от ${gameData.players[0]}`)
    }
  }, [gameData])

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold">Игра в комнате {code}</h1>
      <p>
        Сейчас на очереди: <b>{currentPlayer}</b>
      </p>
      <p>{currentText}</p>
    </div>
  )
}
