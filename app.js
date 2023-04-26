import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import JwtHandler from './src/JwtHandler.js';
import authResource from './middlewave/authRource.js';
import permissionPass from './middlewave/permissionPass.js';

// Create an Express app.
const app = express();

// Use the `json()` middleware to parse JSON requests.
app.use(express.json());

// load .env config
dotenv.config();

// Set the port number.
const PORT = process.env.PORT || 3000;

// Create a new `JwtHandler` object.
let jwtHandler = new JwtHandler();

/**
 * Define a route to get the resource.
 * set authRescource be a middlewave to check the req's token
 * and don't need to care the token is own by admin.
 */
app.get('/resource', authResource({ careAdmin: false }), (req, res) => {

  // Get the username from the request.
  const username = req.username;

  // Send a JSON response with a welcome message and username.
  res.json({msg: 'Welcome!! ' + username});
});

// Define a route to get the login page.
app.get('/login', authResource({ careAdmin: false }), (req, res) => {

  /**
   * If the user hasn't token.
   * Send a JSON response with a message telling the user to login.
   */
  res.json({msg: "Please Login!!"});
});

/**
 * Define a route to post the login request.
 * Every client can connect this route.
 */
app.post('/login', (req, res) => {

  // Authenticate the user.
  jwtHandler.authUser(req);

  // Set the response status code and message.
  res.status(jwtHandler.getStatus());
  res.json(jwtHandler.getMsg());
});

/**
 * Define a route to get the admin resource.
 * If the client request to access this route.
 * req need a vaild token and the token is own by admin
 */
app.get('/admin_resource', authResource({ careAdmin: true }), (req, res) => {

  // Get the username from the request.
  const username = req.username;

  // Send a JSON response with a welcome message for the admin.
  res.json({msg: 'Welcome Admin !! ' + username});
});

// Define a list of routes that require permission.
const permissionsRoute = ['/a', '/b', '/c'];

// Iterate over the list of permissions routes.
permissionsRoute.forEach(path => {

  // Define a route to get the resource.
  app.get(path, 
      authResource({ careAdmin: false }), 
      permissionPass, 
      (req, res) => {
          const username = req.username;
          const url = req.url;
          res.json({msg: 'Hello, ' + username + '. You have access to Resource ' + url});
  });
});

//  Listen on port 3000 and export the app for testing.
export default app.listen(PORT, function (err) {
    if (err) console.log(err);
    console.log("Server listening on PORT", PORT);
});

