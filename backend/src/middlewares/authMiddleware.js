const authService = require("../services/authService")
require("dotenv").config()
module.exports = function () {
  return function (req, res, next) {
    try {
      const authHeader = req.headers.authorization
      if (!authHeader) {
        return res.status(403).json({ message: "Доступ запрещен!" })
      }
      const token = req.headers.authorization.split(" ")[1]
      if (!token) {
        return res.status(403).json({ message: "Доступ запрещен!" })
      }
      const auth = authService.validateAccessToken(token)

      if (!auth) {
        return res.status(403).json({ message: "Доступ запрещен!" })
      }
      next()
    } catch (e) {
      return res.status(403).json({ message: "Доступ запрещен!" })
    }
  }
}
