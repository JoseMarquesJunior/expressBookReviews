const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
let authenticatedUser = require('./router/auth_users.js').authenticatedUser; // Corrigi a importação aqui
const { getBooksAsync } = require('./router/general.js'); // Adjust the path accordingly
const axios = require('axios');

//comentário
const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    //Write the authenication mechanism here
    if(req.session.authorization) {
        token = req.session.authorization['accessToken'];
        jwt.verify(token, "access",(err,user)=>{
            if(!err){
                req.user = user;
                next();
            }
            else{
                return res.status(403).json({message: "User not authenticated"})
            }
         });
     } else {
         return res.status(403).json({message: "User not logged in"})
     }
    
});

app.get('/books', async (req, res) => {
    try {
      const books = await getBooksAsync();
      res.json({ books });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  
const PORT =5000;

// Add the route before customer_routes
app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
