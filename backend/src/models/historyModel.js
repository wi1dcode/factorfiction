const { Schema, model } = require("mongoose")

const History = new Schema(
  {
    game: {
      type: Schema.Types.ObjectId,
      ref: "Game",
    },
    winner: [
      {
        type: String,
      },
    ],
    totalPlayers: {
      type: Number,
    },
    room: {
      type: Schema.Types.ObjectId,
      ref: "Room",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

module.exports = model("History", History)
