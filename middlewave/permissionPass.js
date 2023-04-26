import JwtHandler from '../src/JwtHandler.js';

/** 
 * Define a function called `permissionPass`.
 * in here, every user has different permissions
 * for access the route resource.
 * here need to check the user permissions
 * If user has permissions for req url,
 * let him to access the resource.
 */
const permissionPass = (req, res, next) => {

  // Check if the user has permission to access the requested resource.
  if (req.permissions.includes(req.url)) {

    // If the user has permission, call `next()` to continue the request.
    next();
  } else {

    /** If the user does not have permission, 
     * set the response status code and message and return.
     */
    res.status(403)
      .json({ msg: 'You are not authorized to access this resource.'});
  }
};

export default permissionPass;

