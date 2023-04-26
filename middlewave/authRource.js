import JwtHandler from '../src/JwtHandler.js';

/**
 * Define a function called `authResource`.
 * This function is use for express's middlewave.
 * for check client req's token.
 * If the token is vaild and has a enough permissions.
 * let the client to access the resource.
 *
 * param careAdmin   a flag for mark 
 *                   it is need to care req is from admin or not.
 */
const authResource = (careAdmin) => {

  return (req, res, next) => {

    // Create a new `JwtHandler` object.
    let jwtHandler = new JwtHandler();

    // Verify the JWT token in the request.
    jwtHandler.accessResource(req, careAdmin.careAdmin);

    /**
     * If the JWT token is valid, 
     * set the `username` and `permissions` properties 
     * on the request object and call `next()`.
     */
    if (jwtHandler.getNext()) {
      req.username = jwtHandler.getUsername();
      req.permissions = jwtHandler.getPermissions();
      next();
    } else {

      /**
       * If the JWT token is not valid, 
       * set the response status code and message and return.
       */
      res.status(jwtHandler.getStatus());
      res.json(jwtHandler.getMsg());
    }
  };
};

export default authResource;

