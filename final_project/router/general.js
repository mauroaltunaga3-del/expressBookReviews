const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
        message: "Username and password are required"
    });
  }
  const exists = users.some(
    (user) => user.username  === username
  );
  if (exists) {
    return res.status(409).json({
        message: "Username already exists"
    });
  }
  users.push({username, password});

  return res.status(201).json({
    message: "User registered successfully"
  });
});

// Task 10 - Get the book list using Promise
public_users.get('/', function (req, res) {
    Promise.resolve(books)
      .then((bookList) => {
        return res.status(200).json(bookList);
      })
      .catch((error) => {
        return res.status(500).json({
          message: "Error retrieving books"
        });
      });
  });
  
  
  // Task 11 - Get book details based on ISBN using Promise
  public_users.get('/isbn/:isbn', function (req, res) {
    const { isbn } = req.params;
  
    Promise.resolve(books[isbn])
      .then((book) => {
        if (book) {
          return res.status(200).json(book);
        }
  
        return res.status(404).json({
          message: "Book not found"
        });
      })
      .catch((error) => {
        return res.status(500).json({
          message: "Error retrieving book"
        });
      });
  });
  
  
  // Task 12 - Get book details based on author using Promise
  public_users.get('/author/:author', function (req, res) {
    const { author } = req.params;
  
    Promise.resolve(
      Object.keys(books).filter((isbn) => books[isbn].author === author)
    )
      .then((isbns) => {
        const result = {};
  
        isbns.forEach((isbn) => {
          result[isbn] = books[isbn];
        });
  
        return res.status(200).json(result);
      })
      .catch((error) => {
        return res.status(500).json({
          message: "Error retrieving books by author"
        });
      });
  });
  
  
  // Task 13 - Get book details based on title using Promise
  public_users.get('/title/:title', function (req, res) {
    const { title } = req.params;
  
    Promise.resolve(
      Object.keys(books).filter((isbn) => books[isbn].title === title)
    )
      .then((isbns) => {
        const result = {};
  
        isbns.forEach((isbn) => {
          result[isbn] = books[isbn];
        });
  
        return res.status(200).json(result);
      })
      .catch((error) => {
        return res.status(500).json({
          message: "Error retrieving books by title"
        });
      });
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const { isbn } = req.params;

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews)
} else {
    return res.status(404).json({
        message: "Book not found"
    })
}
});

module.exports.general = public_users;
