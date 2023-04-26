import mongoose from 'mongoose';
const { Schema, model } = mongoose;

// Create a new Schema object for the User model.
const userSchema = new Schema({
  // The username of the user.
  username: {
    // The type of the username is String.
    type: String,
    // The username is required.
    required: true,
  },
  // The password of the user.
  password: {
    // The type of the password is String.
    type: String,
    // The password is required.
    required: true,
  },
  // Whether or not the user is an admin.
  isAdmin: {
    // The type of isAdmin is Boolean.
    type: Boolean,
    // isAdmin is required.
    required: true,
  },
  // The permissions of the user.
  permissions: [{
    // The type of permissions is String and for access web resource.
    type: String,
  }],
});

// Create a new Mongoose model for the User model.
const User = model('User', userSchema);

export default User;

