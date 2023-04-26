import mongoose from 'mongoose';

// Import the User model from the `./model/User.js` file.
import User from './model/User.js';

class DbHandler {

  constructor() {

    // The MongoDB URL for the database.
    this.mongodbUrl = 'mongodb://localhost/JwtLab';

    // Connect to MongoDB at init that Class.
    this.connectDb().catch(err => console.log(err));

  }

  // The function to connect to the database.
  async connectDb() {

    // Connect to the database using the MongoDB URL.
    await mongoose.connect(this.mongodbUrl);
  }

  // The function to close the database connection.
  async closeDbConnection() {

    // Close the database connection.
    await mongoose.connection.close();
  }

  // The function to add a user to the database.
  async addUser(user) {

    // Create a new User object from the user object.
    const recordUser = new User(user);

    // Save the User object to the database.
    await recordUser.save();
  }

  /**
   * The function to find all records follow the searchObj.
   * Allways is use {} be a searchObj, for find all users in the database.
   */
  async findAll(searchObj) {

    // Find all users in the database that match the search criteria.
    const foundObjs = await User.find(searchObj);

    // Return the found objects.
    return foundObjs;
  }

  // The function to find a single user in the database.
  async findOne(searchObj) {

    // Find a single user in the database that matches the search criteria.
    const foundObjs = await User.findOne(searchObj);

    // Return the found object.
    return foundObjs;
  }
}

// Export the DbHandler class.
export default DbHandler;

