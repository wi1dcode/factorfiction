require("dotenv").config()
const mongoose = require("mongoose")
const PORT = process.env.PORT || 5001
const { MONGODB_URL } = process.env

const server = require("./src/app") // Импортируем server вместо app

mongoose.set("strictQuery", true)

const start = async () => {
  try {
    await mongoose.connect(MONGODB_URL)
    server.listen(PORT, () => {
      console.log(`server started on ${PORT}`)
    })
  } catch (e) {
    console.log(e)
  }
}

start()
