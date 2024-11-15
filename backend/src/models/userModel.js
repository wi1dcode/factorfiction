const { Schema, model } = require("mongoose")

const User = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    score: {
      type: Number,
      default: 0,
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    secretQuestion: {
      type: String,
      default: null,
    },
    secretAnswer: {
      type: String,
      default: null,
    },
    ip: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

module.exports = model("User", User)
