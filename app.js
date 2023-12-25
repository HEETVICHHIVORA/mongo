const express = require("express");
const { ObjectID } = require('mongodb');
const app = express();
const { getDb, connectToDb } = require("./db");

// Add this line to parse JSON data in the request body
app.use(express.json());

let db;

connectToDb((err) => {
  if (!err) {
    app.listen(3000, () => {
      console.log("listening on port 3000");
    });

    db = getDb();
  }
});

app.get("/books", function (req, res) {
  let books = [];

  db.collection('books')
    .find()
    .sort({ author: 1 })
    .forEach((book) => books.push(book))
    .then(() => {
      res.status(200).json(books);
    })
    .catch(() => {
      res.status(500).json({
        message: "Can't fetch books",
      });
    });
});

app.get("/books/:id", function (req, res) {
  if (ObjectID.isValid(req.params.id)) {
    db.collection('books')
      .findOne({ _id: new ObjectID(req.params.id) })
      .then(book => {
        res.status(200).json(book);
      })
      .catch(err => {
        res.status(500).json({
          message: "Can't fetch book",
        });
      });
  } else {
    res.status(500).json({
      message: "Can't fetch book",
    });
  }
});

app.post('/books', function (req, res) {
    console.log(req.body); // Log the received JSON payload
  
    const book = req.body;
  
    db.collection("books")
      .insertOne(book)
      .then(result => {
        res.status(201).json({
          message: "Book created successfully",
          book: result.ops[0],
        });
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({
          message: "Error creating book",
        });
      });
  });
  