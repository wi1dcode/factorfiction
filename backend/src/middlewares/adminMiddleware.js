const jwt = require("jsonwebtoken")
require("dotenv").config()
module.exports = function () {
  return function (req, res, next) {
    try {
      const token = req.headers.authorization.split(" ")[1]
      console.log("token:" + token)
      if (!token) {
        return res.status(403).json({ message: "You need to login first" })
      }
      const userRole = jwt.verify(token, process.env.SECRET)
      let hasRole = false
      if (userRole.role === "ADMIN") {
        hasRole = true
      }
      if (!hasRole) {
        return res.status(403).json({ message: "Not access" })
      }
      next()
    } catch (e) {
      console.log(e)
      return res.status(403).json({ message: "You need to login first" })
    }
  }
}
