import DbHandler from './DbHandler.js';

const dbHandler = new DbHandler();

const addUsers = async () => {

  // Create an array of users.
  const users = [
    {
      username: 'Frankie',
      password: '123456',
      isAdmin: true,
    },
    {
      username: 'Mazvita',
      password: 'mazpwd',
      isAdmin: false,
      permissions: ['/a'],
    },
    {
      username: 'Meagan',
      password: 'meapwd',
      isAdmin: false,
      permissions: ['/a', '/b'],
    },
    {
      username: 'Kabelo',
      password: 'kabpwd',
      isAdmin: false,
      permissions: ['/b', '/c'],
    }
  ];

  // Iterate over the array of users and add each user to the database.
  for (let i = 0; i < users.length; i++) {
    await dbHandler.addUser(users[i]);
  }
};

// Define a function called foundAll for testing.
const foundAll = () => {

  // Find all users in the database.
  return dbHandler.findAll({});
};

// Define a function called foundOne for testing.
const foundOne = (username) => {

  // Find a single user in the database by username.
  return dbHandler.findOne({username});
};

// Add the users to the database.
await addUsers();

// Find all users in the database and log them to the console.
await foundAll().then((allUser) => {
  console.log(allUser);
});

// Find a single user in the database by parameter and log them to the console.
await foundOne("Frankie").then((user) => {
  console.log("Find One:");
  console.log(user);
});

// Close the database connection.
dbHandler.closeDbConnection();
