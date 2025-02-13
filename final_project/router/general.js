const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req,res) => {
    //Write your code here
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    // Check if the username already exists
    if (!isValid(users, username)) {
        return res.status(409).json({ message: "Username already exists. Choose a different username." });
    }

    // Register the new user
    users.push({"username":username,"password":password});
    //console.log(users)
    return res.status(201).json({ message: "User registered successfully."});

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
    const requestedTitle = req.params.title;
    const matchingBooks = [];
  
    // Iterate through the 'books' object and check for matching titles
    Object.keys(books).forEach((key) => {
      if (books[key].title === requestedTitle) {
        matchingBooks.push(books[key]);
      }
    });
  
    if (matchingBooks.length > 0) {
      return res.status(200).json(matchingBooks);
    } else {
      return res.status(404).json({ message: "Books by the title not found" });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const requestedISBN = req.params.isbn;

  if (books.hasOwnProperty(requestedISBN)) {
    const bookReviews = books[requestedISBN].reviews;
    return res.status(200).json(bookReviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Function to get the list of books using async-await with Axios
const getBooksAsync = async () => {
    try {
      const response = await axios.get('https://jmarquesoliv-5000.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/books'); // Replace with your API endpoint
      return response.data;
    } catch (error) {
      console.error('Error fetching books:', error.message);
      throw error;
    }
  };

  // Function to get book details using async-await with Axios
const getBookDetailsAsync = async (isbn) => {
    try {
        const response = await axios.get(`https://jmarquesoliv-5000.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/books/isbn/${isbn}`); // Replace with your API endpoint
        return response.data;
    } catch (error) {
        console.error('Error fetching book details:', error.message);
        throw error;
    }
};

// Function to get books by author using async-await with Axios
const getBooksByAuthorAsync = async (author) => {
    try {
        const response = await axios.get(`https://jmarquesoliv-5000.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/books/author/${author}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching books by author:', error.message);
        throw error;
    }

    
    // Function to get books by title using async-await with Axios
const getBooksByTitleAsync = async (title) => {
    try {
        const response = await axios.get(`https://jmarquesoliv-5000.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/books/title/${title}`); 
        return response.data;
    } catch (error) {
        console.error('Error fetching books by title:', error.message);
        throw error;
    }
};
module.exports.general = public_users;
module.exports = getBooksAsync;
