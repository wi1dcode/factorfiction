const express = require("express")
// const multer = require("multer")
// const { check } = require("express-validator")
const roomController = require("../controllers/roomController")
const creatorMiddleware = require("../middlewares/creatorMiddleware")
const authMiddleware = require("../middlewares/authMiddleware")

const router = express.Router()

router.post("/create", authMiddleware(), roomController.createRoom)
router.post("/join/:id", roomController.joinRoom)
router.get("/open", roomController.getAllOpenRooms)
router.get("/private", roomController.getAllPrivateRooms)
router.put("/:id", roomController.updateRoom)
router.delete("/:id", roomController.deleteRoom)

// const upload = multer({ dest: "uploads/profiles" })
// const fs = require("fs")

module.exports = router
