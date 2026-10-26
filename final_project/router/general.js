const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


// ==========================================
// REGISTER USER
// ==========================================

public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    const exists = users.some(
        (user) => user.username === username
    );

    if (exists) {
        return res.status(409).json({
            message: "Username already exists"
        });
    }

    users.push({ username, password });

    return res.status(201).json({
        message: "User registered successfully"
    });
});


// ==========================================
// GET ALL BOOKS - EXPRESS ROUTE
// ==========================================

public_users.get('/', (req, res) => {
    return res.status(200).json(books);
});


// ==========================================
// GET BOOK BY ISBN - EXPRESS ROUTE
// ==========================================

public_users.get('/isbn/:isbn', (req, res) => {
    const { isbn } = req.params;

    if (!books[isbn]) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    return res.status(200).json(books[isbn]);
});


// ==========================================
// GET BOOKS BY AUTHOR - EXPRESS ROUTE
// ==========================================

public_users.get('/author/:author', (req, res) => {
    const { author } = req.params;

    const result = {};

    Object.keys(books).forEach((isbn) => {
        if (books[isbn].author === author) {
            result[isbn] = books[isbn];
        }
    });

    return res.status(200).json(result);
});


// ==========================================
// GET BOOKS BY TITLE - EXPRESS ROUTE
// ==========================================

// GET BOOKS BY TITLE - EXPRESS ROUTE

public_users.get('/title/:title', (req, res) => {
    const { title } = req.params;

    const result = Object.entries(books)
        .filter(([isbn, book]) => book.title === title)
        .map(([isbn, book]) => ({
            isbn,
            author: book.author,
            title: book.title,
            reviews: book.reviews
        }));

    return res.status(200).json(result);
});


// ==========================================
// GET BOOK REVIEW - EXPRESS ROUTE
// ==========================================

public_users.get('/review/:isbn', (req, res) => {
    const { isbn } = req.params;

    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    }

    return res.status(404).json({
        message: "Book not found"
    });
});


// ==========================================
// TASK 10 - GET ALL BOOKS USING ASYNC/AWAIT
// ==========================================

const getAllBooks = async () => {
    try {
        const response = await axios.get('http://localhost:5000/');

        console.log("Task 10 - All Books:");
        console.log(response.data);

        return response.data;

    } catch (error) {
        console.error("Task 10 Error:", error.message);
        throw error;
    }
};


// ==========================================
// TASK 11 - GET BOOK BY ISBN USING PROMISES
// ==========================================

const getBookByISBN = (isbn) => {
    return axios.get(
        `http://localhost:5000/isbn/${encodeURIComponent(isbn)}`
    )
    .then((response) => {
        console.log("Task 11 - Book by ISBN:");
        console.log(response.data);

        return response.data;
    })
    .catch((error) => {
        console.error("Task 11 Error:", error.message);
        throw error;
    });
};


// ==========================================
// TASK 12 - GET BOOKS BY AUTHOR USING PROMISES
// ==========================================

const getBooksByAuthor = (author) => {
    return axios.get(
        `http://localhost:5000/author/${encodeURIComponent(author)}`
    )
    .then((response) => {
        console.log("Task 12 - Books by Author:");
        console.log(response.data);

        return response.data;
    })
    .catch((error) => {
        console.error("Task 12 Error:", error.message);
        throw error;
    });
};


// ==========================================
// TASK 13 - GET BOOKS BY TITLE USING PROMISES
// ==========================================

const getBooksByTitle = (title) => {
    return axios.get(
        `http://localhost:5000/title/${encodeURIComponent(title)}`
    )
    .then((response) => {
        console.log("Task 13 - Books by Title:");
        console.log(response.data);

        return response.data;
    })
    .catch((error) => {
        console.error("Task 13 Error:", error.message);
        throw error;
    });
};


// ==========================================
// EXPORTS
// ==========================================

module.exports.general = public_users;

module.exports.getAllBooks = getAllBooks;
module.exports.getBookByISBN = getBookByISBN;
module.exports.getBooksByAuthor = getBooksByAuthor;
module.exports.getBooksByTitle = getBooksByTitle;
