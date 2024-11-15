const jwt = require("jsonwebtoken")
require("dotenv").config()

class AuthService {
  // generateTokens(id, email, roles, status) {
  //   const payload = {
  //     id,
  //     email,
  //     roles,
  //     status,
  //   }
  //   console.log(payload)
  //   const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
  //     expiresIn: "1h",
  //   })
  //   const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
  //     expiresIn: "30d",
  //   })
  //   return {
  //     accessToken,
  //     refreshToken,
  //   }
  // }

  generateAccessToken = (id, role, username) => {
    const payload = {
      id,
      role,
      username,
    }
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: "3d",
    })
  }

  validateAccessToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
      return userData
    } catch (e) {
      return null
    }
  }

  // async validateRefreshToken(token) {
  //   try {
  //     const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
  //     return userData
  //   } catch (e) {
  //     return null
  //   }
  // }
}

module.exports = new AuthService()
