import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import DbHandler from '../database/DbHandler.js';

/**
 *  defines a class called JwtHandler that 
 * handles JSON Web Tokens (JWT) for user authentication. 
 */
class JwtHandler {

  // The constructor for the `JwtHandler` class.
  constructor() {

    // load .env config
    dotenv.config();

    // Create a new `DbHandler` object.
    this.dbHandler = new DbHandler();

    // Find all users in the database.
    this.findAll();

    // The secret key for signing JWT tokens.
    this.secretKey = process.env.SECRET_KEY || '^%#34UIdacv&8da._=';

    // Whether or not the next request should be allowed.
    this.next = false;

    // The status code of the response.
    this.resStatus = 0;

    // The message of the response.
    this.resMsg = {};

    // The username of the user.
    this.username = null;

    // The permissions of the user.
    this.permissions = [];
  }

  // Find all users in the database.
  async findAll() {

    /**
     * Find all users in the database and 
     * assing to userdb.
     */
    this.userdb = await this.dbHandler.findAll({});
  }

  /**
   * Authenticate a user. 
   *
   * param req     webpage's req.
   */
  authUser(req) {

    // Get the username and password from the request body.
    const { username, password } = req.body;

    // Find the user in the userdb database.
    const user = this.userdb.find(
      u => u.username === username
      && u.password === password
    );

    // If the user is not found, return an error.
    if (!user) {
      this.resStatus = 401;
      this.resMsg = { msg: 'Invalid username or password' };
      return;
    }

    // Create a JWT token for the user.
    const token = this.createToken(user.username, user.isAdmin, user.permissions);

    // Set the response status code and message.
    this.resStatus = 200;
    this.resMsg = { token };
  }

  // Check if a token is valid.
  hasToken(token) {

    // If the token is not present, return an error.
    if (!token) {
      this.resStatus = 401;
      this.resMsg = { msg: 'No token found' };
      return false;
    }

    // Return true if the token is valid.
    return true;
  }

  // Get the token from the request.
  getToken(req) {

    // Get the token from the request header.
    return req.header('Authorization');
  }

  // Decode and verify a token.
  decodeToken(token, careAdmin) {
    // Verify the JWT token
    try {
      const decoded = jwt.verify(token, this.secretKey);
      
      // If admin authorization is required and user is not an admin, return an error.
      if (careAdmin && !decoded.isAdmin) {
        this.resStatus = 403;
        this.resMsg = { 
          msg: 'You are not authorized to access this resource'
        };
        return
      }
      
      /**
       * Set the next flag to true, 
       * indicating that the next request should be allowed.
       * It is for express's middlewave.
       */
      this.next = true;
      
      // Set the status code, username, and permissions.
      this.resStatus = 200;
      this.permissions = decoded.permissions;
      this.username = decoded.username;
    } catch (err) {
      
      // If the token is invalid, return an error.
      this.resStatus = 402;
      this.resMsg = { msg: 'Invalid token' };
    }
  }

  /**
   * This method checks 
   * if the user making the request has a valid JWT token and, 
   * if so, decodes the token and sets the appropriate fields. 
   * The careAdmin parameter is a boolean that determines whether
   * the method should check if the user is an admin or not.
   */
  accessResource(req, careAdmin) {
    const token = this.getToken(req);

    // Check Token, here don't care req is admin or not.
    if (!this.hasToken(token)) {
      return;
    };
  
    this.decodeToken(token, careAdmin);
  }
  
  /** 
   * This method creates a new JWT token for the user,
   * using the jsonwebtoken library.
   * The token includes the user's username, 
   * whether or not the user is an admin, and the user's permissions.
   */
  createToken(username, isAdmin, permissions) {
    const loginToken = jwt.sign(
      { username, isAdmin, permissions },
      this.secretKey,
      { expiresIn: '1h' }
    );
    return loginToken;
  }

  getStatus() {
    return this.resStatus;
  }

  getMsg() {
    return this.resMsg;
  }

  getNext() {
    return this.next;
  }

  getUsername() {
    return this.username;
  }

  getPermissions() {
    return this.permissions;
  }
  
}

export default JwtHandler;
