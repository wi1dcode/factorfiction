const User = require("../models/userModel")
const authService = require("./authService")

module.exports = async function getUserData(token) {
  if (!token) {
    throw new Error("Token is missing")
  }

  const userData = authService.validateAccessToken(token)
  if (!userData) {
    throw new Error("Token invalid")
  }

  const user = await User.findById(userData.id).select(
    "-secretAnswer -password -ip"
  )

  if (!user) {
    throw new Error("User not found")
  }

  return user
}
