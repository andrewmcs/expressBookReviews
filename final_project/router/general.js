const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

//Function to check if the user exists
const doesExist = (username) => {
    let userswithsamename = users.filter((user) => {
        return user.username === username
    });
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}


public_users.post("/register", (req, res) => {
    const username = req.query.username;
    const password = req.query.password;

    if (username && password) {
        if (!doesExist(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    let myPromise = new Promise(function (resolve, reject) {
        setTimeout(function () { resolve(JSON.stringify({ books }, null, 4)); }, 3000);
    });

    myPromise.then(function (value) {
        res.send(value);
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    let myPromise = new Promise(function (resolve, reject) {
        const isbn = req.params.isbn;
        setTimeout(function () { resolve(books[isbn]); }, 3000);
    });

    myPromise.then(function (value) {
        res.send(value);
    });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {

    //Creating a promise method. The promise will get resolved when timer times out after 3 seconds.
    let myPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
            const author = req.params.author;
            let books_found = {};

            for (let isbn in books) {
                if (books[isbn].author == author) {
                    books_found[isbn] = books[isbn];
                }
            }
            resolve(books_found);
        }, 3000)
    });
    myPromise.then((value) => {
        res.send(value);
    })

});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    //Creating a promise method. The promise will get resolved when timer times out after 3 seconds.
    let myPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
            const title = req.params.title;
            let books_found = {};
        
            for (let isbn in books) {
                if (books[isbn].title == title) {
                    books_found[isbn] = books[isbn];
                }
            }
            resolve(books_found);
        }, 3000)
    });
    myPromise.then((value) => {
        res.send(value);
    })
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    let myPromise = new Promise(function (resolve, reject) {
        setTimeout(function () { resolve(books[isbn].reviews); }, 3000);
    });

    myPromise.then(function (value) {
        res.send(value);
    });
});

module.exports.general = public_users;
