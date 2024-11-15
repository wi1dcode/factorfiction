require("dotenv").config()
const User = require("../models/userModel")
const bcrypt = require("bcryptjs")
const { validationResult } = require("express-validator")
const authService = require("../services/authService")
const getUserData = require("../services/getUserData")

// const multer = require("multer")
// const upload = multer({ dest: "uploads/profiles" })

const register = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Ошибка при регистрации", errors })
    }
    const { username, password } = req.body
    const candidate = await User.findOne({ username })
    if (candidate) {
      return res.status(400).json({ message: "Уже зарегистрирован" })
    }
    const hashPassword = bcrypt.hashSync(password, 7)
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress
    const user = new User({
      username,
      password: hashPassword,
      ip,
    })
    await user.save()
    return res.json({ message: "Зарегистрирован" })
  } catch (e) {
    console.log(e)
    res.status(400).json({ message: "Ошибка сервера при регистрации" })
  }
}

const login = async (req, res) => {
  try {
    const { username, password } = req.body
    const user = await User.findOne({ username })
    if (!user) {
      return res
        .status(400)
        .json({ message: `Пользователь ${username} не найден!` })
    }
    const validPassword = bcrypt.compareSync(password, user.password)
    if (!validPassword) {
      return res.status(400).json({ message: `Неверный пароль!` })
    }
    const token = authService.generateAccessToken(
      user._id,
      user.role,
      user.username
    )
    const userData = await getUserData(token)
    return res.json({ token, user: userData })
  } catch (e) {
    console.log(e)
    res.status(400).json({ message: "Ошибка сервера при авторизации" })
  }
}

const getMe = async (req, res) => {
  try {
    const user = await getUserData(
      req.headers.authorization.split("Bearer ")[1]
    )
    res.json(user)
  } catch (e) {
    res
      .status(e.message === "Token invalid" ? 403 : 500)
      .json({ message: e.message })
  }
}

const validateToken = async (req, res) => {
  try {
    const token = req.headers.authorization
    if (!token) {
      return res.status(403).json({ message: "Токен отсуствует" })
    }

    const userData = authService.validateAccessToken(token.split("Bearer ")[1])

    return res.status(200).json({ userData })
  } catch (e) {
    res.status(403).json({ message: "Недействительный токен" })
  }
}

// const reset-passoword = async (req, res) => {null}
// const refresh = async (req, res) => {null}

module.exports = {
  register,
  login,
  validateToken,
  getMe,
}
