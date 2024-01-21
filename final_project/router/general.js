const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  const booksList = JSON.stringify(books, null, 2); // The third parameter (2) is for indentation
  res.send(booksList);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const requestedISBN = req.params.isbn;
  
    // Check if the requested ISBN exists in the books object
    if (books.hasOwnProperty(requestedISBN)) {
      const bookDetails = books[requestedISBN];
      return res.status(200).json(bookDetails);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  });

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const requestedAuthor = req.params.author;
    const matchingBooks = [];
  
    // Iterate through the 'books' object and check for matching authors
    Object.keys(books).forEach((key) => {
      if (books[key].author === requestedAuthor) {
        matchingBooks.push(books[key]);
      }
    });
  
    if (matchingBooks.length > 0) {
      return res.status(200).json(matchingBooks);
    } else {
      return res.status(404).json({ message: "Books by the author not found" });
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
