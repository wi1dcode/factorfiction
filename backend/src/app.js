const express = require("express")
const http = require("http")
const cors = require("cors")
const path = require("path")
const socketIo = require("socket.io")

const userRouter = require("./routes/userRouter")
const authRouter = require("./routes/authRouter")
const roomRouter = require("./routes/roomRouter")
const adminRouter = require("./routes/adminRouter")

const app = express()
const server = http.createServer(app)

// Настройка cors и других middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
)
app.use(express.json())

// Инициализация Socket.IO
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL ?? "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
})

// Подключение обработчиков событий сокета после инициализации io
require("./socket")(io)

app.use("/api", authRouter)
app.use("/api/profile", userRouter)
app.use("/api/room", roomRouter)
app.use("/api/dashboard", adminRouter)

// Serve the public folder for public resources
app.use(express.static(path.join(__dirname, "../public")))

// Serve REACT APP
app.use(express.static(path.join(__dirname, "..", "..", "frontend", "dist")))

module.exports = server
