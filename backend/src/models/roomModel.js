const { Schema, model } = require("mongoose")

const Room = new Schema(
  {
    creator: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    maxPlayers: {
      type: Number,
      default: 10,
      max: 10,
    },
    players: [
      {
        socketId: { type: String, required: true },
        nickname: { type: String, required: true },
        status: {
          type: String,
          enum: ["connected", "disconnected"],
          default: "connected",
        },
      },
    ],
    code: {
      type: String,
      unique: true,
    },
    questions: [
      {
        text: String,
        truth: Boolean,
        author: String,
        votes: [
          {
            nickname: String,
            vote: Boolean,
          },
        ],
      },
    ],
    interval: {
      type: String,
      enum: ["15s", "30s", "1m", "2m", "3m", "5m"],
      default: "30s",
    },
    results: [
      {
        player: String,
        score: Number,
      },
    ],
    status: {
      type: String,
      enum: ["created", "process", "finished"],
      default: "created",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

module.exports = model("Room", Room)
