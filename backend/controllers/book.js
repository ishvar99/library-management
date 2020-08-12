const Book = require("../models/book")
const Genre = require("../models/genre")
// const formidable = require("formidable")
const fs = require("fs")

// middleware for req.book
exports.getBookByID = async (req, res, next, id) => {
  try {
    const book = await Book.findById(id).populate("genre")
    if (!book) {
      return res.status(400).json({
        error: "Book not found!",
      })
    }
    req.book = book
    next()
  } catch (error) {
    return res.status(400).json({
      error: "An error occured... Unable to find",
    })
  }
}

// get book route
exports.getBook = (req, res) => {
  // req.book.bookCover = undefined
  // req.book.bookCoverBg = undefined
  // console.log(req.book)
  return res.json(req.book)
}

// get book cover - middleware
// exports.getBookCover = (req, res, next) => {
//   if (req.book.bookCover.data) {
//     res.set("Content-Type", req.book.bookCover.contentType)
//     return res.send(req.book.bookCover.data)
//   }
//   next()
// }

// get book cover Bg- middleware
// exports.getBookCoverBg = (req, res, next) => {
//   if (req.book.bookCoverBg.data) {
//     res.set("Content-Type", req.book.bookCoverBg.contentType)
//     return res.send(req.book.bookCoverBg.data)
//   }
//   next()
// }

// create book
exports.createBook = async (req, res, next) => {
  console.log("Create Book")
  const { title, description, genre } = req.body
  const parsedGenre = JSON.parse(genre)
  const url = req.protocol + "://" + req.get("host")
  const response = await Genre.find({ name: { $in: parsedGenre } })
  console.log(response)
  if (!title || !description) {
    return res.status(400).json({
      errormsg: "Please provide all the relevant details",
    })
  }
  let newBook = new Book({ title, description })
  response.forEach((genre) => {
    newBook.genre.push(genre._id)
  })

  newBook.bookCover = url + "/resources/" + req.file.filename
  newBook.save((err, book) => {
    if (err) {
      return res.status(400).json({
        error: "An error occured! while saving into database",
      })
    }
    res.json(book)
  })
}
// exports.createBook = (req, res) => {
//   let createForm = new formidable.IncomingForm()
//   createForm.keepExtensions = true
//   createForm.parse(req, (err, fields, file) => {
//     if (err) {
//       return res.status(400).json({
//         error: "Might be a problem with the book cover ",
//       })
//     }

//     const { title, description, genre, author } = fields
//     console.log(title, description)
//     // check if all the relevent details are present
//     if (!title || !description || !genre || !author) {
//       return res.status(400).json({
//         errormsg: "Please provide all the relevant details",
//       })
//     }
//     let newBook = new Book(fields)

//     if (file.bookCover && file.bookCoverBg) {
//       if (
//         file.bookCover > 2 * 1024 * 1024 ||
//         file.bookCoverBg > 4 * 1024 * 1024
//       ) {
//         return res.status(400).json({
//           errormsg: "File size is too big",
//         })
//       }
//       newBook.bookCover.data = fs.readFileSync(file.bookCover.path)
//       newBook.bookCoverBg.data = fs.readFileSync(file.bookCoverBg.path)
//       newBook.bookCover.contentType = file.bookCover.type
//       newBook.bookCoverBg.contentType = file.bookCoverBg.type
//     }

//     newBook.save((err, book) => {
//       if (err) {
//         return res.status(400).json({
//           error: "An error occured! while saving into database",
//         })
//       }
//       res.json(book)
//     })
//   })
// }
exports.getBooksByGenre = async (req, res) => {
  console.log(req.genre)
  let books = await Book.find().populate("genre").exec()
  books = books.filter((item) => {
    return item.genre.filter((e) => e.name === req.params.type).length > 0
  })
  res.json(books)
}
exports.deleteBook = (req, res) => {
  const book = req.book
  book.remove((err, deletedBook) => {
    if (err) {
      return res.status(400).json({
        error: "Error occured while deleting the book",
      })
    }
    res.json({
      message: "The book has been successfully removed",
      deletedBook,
    })
  })
}
