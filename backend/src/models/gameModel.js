const { Schema, model } = require("mongoose")

const Game = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
    players: [
      {
        nickname: String,
        ip: String,
      },
    ],
    questions: [
      {
        text: String,
        truth: Boolean,
        author: String,
      },
    ],
    results: [
      {
        player: String,
        score: Number,
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

module.exports = model("Game", Game)
