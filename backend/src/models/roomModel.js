const { Schema, model } = require("mongoose")

const Room = new Schema(
  {
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["open", "private"],
    },
    maxPlayers: {
      type: Number,
      default: 10,
      max: 10,
    },
    players: [
      {
        type: String,
      },
    ],
    code: {
      type: String,
    },
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
    winner: {
      type: String,
    },
    status: {
      type: String,
      enum: ["created", "proccess", "finished"],
      default: "created",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

module.exports = model("Room", Room)
