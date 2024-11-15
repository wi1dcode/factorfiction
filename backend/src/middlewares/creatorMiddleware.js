const Room = require("../models/roomModel")
const jwt = require("jsonwebtoken")
require("dotenv").config()

module.exports = function () {
  return async function (req, res, next) {
    try {
      const token = req.headers.authorization.split(" ")[1]
      if (!token) {
        return res.status(403).json({ message: "Необходима авторизация" })
      }

      const decodedUser = jwt.verify(token, process.env.SECRET)
      req.user = decodedUser

      const room = await Room.findById(req.params.id)
      if (!room) {
        return res.status(404).json({ message: "Комната не найдена" })
      }

      if (
        room.creator.toString() !== req.user.id &&
        req.user.role !== "ADMIN"
      ) {
        return res
          .status(403)
          .json({ message: "Нет прав для изменения комнаты" })
      }

      next()
    } catch (e) {
      console.log(e)
      res.status(403).json({ message: "Ошибка авторизации" })
    }
  }
}
