const express = require("express")
// const multer = require("multer")
const { check } = require("express-validator")
const authController = require("../controllers/authController")
const authMiddleware = require("../middlewares/authMiddleware")

const router = express.Router()

// const upload = multer({ dest: "uploads/profiles" })
// const fs = require("fs")

router.post(
  "/register",
  [
    check("username", "Username can not be empty").notEmpty(),
    check("password", "Password must be between 4 and 10 symboles")
      .isLength({
        min: 4,
        max: 15,
      })
      .notEmpty(),
  ],
  authController.register
)
router.post(
  "/login",
  [
    check("username", "Username can not be empty").notEmpty(),
    check("password", "Password must be between 4 and 10 symboles")
      .isLength({
        min: 4,
        max: 15,
      })
      .notEmpty(),
  ],
  authController.login
)
router.get("/session", authController.validateToken)
router.get("/userinfo", authMiddleware(), authController.getMe)
// router.get("/refresh", authController.refresh)
// router.post("/logout", authMiddleware(), authController.logout)

module.exports = router
