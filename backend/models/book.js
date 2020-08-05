const mongoose = require("mongoose")
const { ObjectId } = mongoose.Schema.Types

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true,
  },
  description: {
    type: String,
    trim: true,
    max: 2000,
    required: true,
  },
  genre: [
    {
      type: ObjectId,
      ref: "Genre",
    },
  ],

  rating: [
    {
      value: {
        type: Number,
        min: 0,
        max: 10,
      },
      givenBy: {
        type: ObjectId,
        ref: "User",
      },
    },
  ],
  comment: [
    {
      text: {
        type: String,
        max: 100,
      },
      postedby: {
        type: ObjectId,
        ref: "User",
      },
    },
  ],
})

module.exports = mongoose.model("Book", bookSchema)
