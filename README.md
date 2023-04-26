# Express JWT Authorization Example

This is an example Express app that demonstrates
how to implement JWT authorization with
comprehensive access control based on user permissions.
It has the following endpoints:

 - __/resource:__ checks POSTed username and password and produces a JWT.

 - __/admin_resource:__ checks JWT and displays a message
   if the token is verified and the token holder is an admin
   (this endpoint is not used in this example).

 -  __/a,/b,/c__: checks JWT in the auth header
    and displays a message with the username
    if the user has the appropriate permission.

## Getting Started

To get started with this example,
clone this repository and
install the required dependencies using npm or yarn:

        git clone https://github.com/ftloksy/express-jwt-auth-example.git
        cd express-jwt-auth-example
        npm install

Next, create a .env file in the root directory
of the project and set the value of SECRET_KEY to a secret string:

        SECRET_KEY=my_secret_key

Then, start the server using npm start:

        npm start

The server will start listening on http://localhost:3000.
You can use a tool like Postman or curl to send requests to the server.

## Endpoints

 - __POST /login__

  - __Description:__ Checks POSTed username and password and produces a JWT.
  - __Request body:__
     - __username (string):__ The username of the user.
     - __password (string):__ The password of the user.
  - __Response:__
     - __token (string):__ The JWT token for the user.

## Example:

        curl --request POST \
             --url http://localhost:3000/login \
             --header 'Content-Type: application/json' \
             --data '{
                 	"username": "Mazvita",
                 	"password": "password1"
             }'

 - __GET /a__

    - __Description:__ Checks JWT in the auth header
      and displays a message with the username
      if the user has permission to access Resource A.

    - __Request headers:__
        __Authorization (string):__ The JWT token for the user.

   - __Response__
        __msg (string):__ The message that includes the username
        and the access permission.

## Example:

        curl --request GET \
             --url http://localhost:3000/a \
             --header 'Authorization: <token>'

 - __GET /b__  same as /a

 - __GET /c__  same as /a

## License

   This example is released under the MIT License.
   Feel free to use it as a starting
