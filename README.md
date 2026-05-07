# FactorFiction 🎭

> Мультиплеерная игра «Правда или Ложь». Напиши одну правду и одну ложь о себе — другие угадывают!

---

## Стек

| Слой | Технологии |
|------|-----------|
| Frontend | React 18 · React Router · Tailwind CSS · Socket.io-client |
| Backend | Node.js · Express · Socket.io |
| БД | MySQL 8+ |
| Шрифты | Fredoka One · Nunito · Space Mono |

---

## Быстрый старт

### 1. База данных

```bash
mysql -u root -p < backend/src/db/schema.sql
```

### 2. Backend

```bash
cd backend
cp .env.sample .env        # заполни DB_PASSWORD
npm install
npm run dev                # запуск на :5000
```

### 3. Frontend

```bash
cd frontend
cp .env.sample .env        # VITE_BACKEND_URL=http://localhost:5000
npm install
npm run dev                # запуск на :5173
```

---

## Структура проекта

```
factorfiction/
├── backend/
│   └── src/
│       ├── config/         # централизованный конфиг
│       ├── controllers/    # игровая логика (gameController.js)
│       ├── db/             # пул соединений + schema.sql
│       ├── middlewares/    # errorHandler
│       ├── routes/         # /api/health
│       ├── services/       # roomService, playerService, storyService, voteService, roundService
│       ├── socket/         # роутер socket-событий
│       ├── utils/          # helpers, errors, logger
│       ├── app.js
│       └── index.js
│
└── frontend/
    └── src/
        ├── api/            # (зарезервировано для HTTP-запросов)
        ├── components/
        │   ├── ui/         # Button, TimerBar, Modal, Toast
        │   ├── layout/     # GameLayout (Header + Footer + модалки)
        │   └── game/       # AvatarPicker, PlayerAvatar, EmojiBar, RoundBadge
        ├── hooks/          # useTimer, useSocket, useLocalStorage
        ├── pages/
        │   ├── game/       # WritingStage, VotingStage, RoundResultStage, FinishedStage
        │   ├── Home.jsx
        │   ├── Lobby.jsx
        │   ├── Game.jsx
        │   └── NotFound.jsx
        ├── services/       # socket.js (lazy singleton)
        ├── utils/          # constants.js, cn.js
        ├── App.jsx
        └── main.jsx
```

---

## Игровой процесс

```
Главная
  │
  ├─ Создать комнату → Лобби (ждём игроков)
  └─ Войти по коду  → Лобби

Лобби → [Создатель нажимает НАЧАТЬ]
  │
  ↓ WRITING: каждый пишет правду + ложь (таймер)
  │
  ↓ VOTING по раундам (рандомный порядок):
  │   Раунд N: истории игрока X → все голосуют → результат
  │
  ↓ FINISHED: итоговая таблица
```

---

## .env (backend)

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=factorfiction
```

---

## Socket события

| Событие (клиент → сервер) | Описание |
|--------------------------|----------|
| `createRoom`             | Создать комнату |
| `joinRoom`               | Войти / переподключиться |
| `startGame`              | Начать игру (только создатель) |
| `submitStories`          | Отправить правду и ложь |
| `voteStory`              | Проголосовать |
| `nextRound`              | Следующий раунд (только создатель) |
| `sendEmoji`              | Отправить эмодзи |

| Событие (сервер → клиент) | Описание |
|--------------------------|----------|
| `roomCreated`            | Комната создана |
| `joinedRoom`             | Вошёл в комнату + reconnectState |
| `playerJoined`           | Новый игрок |
| `playerDisconnected`     | Игрок отключился |
| `gameStarted`            | Игра началась |
| `playerSubmittedStory`   | Кто-то сдал истории |
| `roundStarted`           | Новый раунд голосования |
| `voteReceived`           | Пришёл голос |
| `roundFinished`          | Раунд закончен |
| `gameEnded`              | Игра закончена |
| `emojiReceived`          | Эмодзи от игрока |
| `gameError`              | Ошибка |

---

## TODO (из оригинального todo.txt)

- [ ] Выбор / рандомная тема раунда
- [ ] Режим с ИИ (Тест Тьюринга)
- [ ] Режим «Найди лжеца» (как мафия)
- [ ] Профиль и ачивки
- [ ] Система очков и покупки
- [ ] Всплывающие эмодзи-анимации
- [ ] Таблица лидеров

---

## Deploy (пример: Railway / Render)

1. Push в GitHub
2. Создать MySQL сервис → запустить schema.sql
3. Deploy backend: `cd backend && npm start`  
4. Deploy frontend: `cd frontend && npm run build` → static hosting  
5. Прописать переменные окружения
