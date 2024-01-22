const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (users, username) => {
    // Check if the username already exists in the array
    const userExists = users.some(user => user.username === username);
    // Return true if the username is valid (does not exist)
    return !userExists;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
    if (authenticatedUser(username,password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization = {
            accessToken,username
        }
        return res.status(200).send("User successfully logged in");
    } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const username = req.session.authorization.username; // Retrieve username from session

    const isbn = req.params.isbn;
    const reviewText = req.query.review;

    if (!reviewText) {
        return res.status(400).json({ message: "Review text is required." });
    }

    // Check if the book with the specified ISBN exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found." });
    }

    // Check if the user has already reviewed the book
    if (books[isbn].reviews.hasOwnProperty(username)) {
        // Modify the existing review
        books[isbn].reviews[username] = reviewText;
        return res.status(200).json({ message: "Review modified successfully." });
    } else {
        // Add a new review
        books[isbn].reviews[username] = reviewText;
        return res.status(201).json({ message: "Review added successfully." });
    }

});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const username = req.session.authorization.username; // Retrieve username from session
    const isbn = req.params.isbn;
  
    // Check if the book with the specified ISBN exists
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found." });
    }
  
    // Check if the user has a review for the specified ISBN
    if (books[isbn].reviews.hasOwnProperty(username)) {
      // Delete the user's review
      delete books[isbn].reviews[username];
      return res.status(200).json({ message: "Review deleted successfully." });
    } else {
      return res.status(404).json({ message: "Review not found." });
    }
  });

module.exports.authenticated = regd_users;
module.exports.authenticatedUser = authenticatedUser;
module.exports.isValid = isValid;
module.exports.users = users;
