/**
 * this is the test_suit for this package.
 */
import chai from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import DbHandler from '../database/DbHandler.js';

import app from '../app.js';

// load .env config
dotenv.config();

const dbHandler = new DbHandler();

const userAccountDb = await dbHandler.findAll({});

const secretKey = process.env.SECRET_KEY || '^%#34UIdacv&8da._=';

chai.use(chaiHttp);
const expect = chai.expect;

/**
 * This method creates a new JWT token for the test,
 * using the jsonwebtoken library.
 * The token includes the user's username,
 * whether or not the user is an admin, and the user's permissions.
 */
function createToken(username, isAdmin, permissions) {
  const loginToken = jwt.sign(
    { username, isAdmin, permissions },
    secretKey,
    { expiresIn: '1h' }
  );
  return loginToken;
}

// Define a describe block for testing.
describe('GET /resource', () => {

  it(`
    Don't has token,
    and Content-Type header should be application/json
    `, (done) => {
      chai.request(app)
        .get('/resource')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(401);
          expect(res).to.be.json;
          expect(res).to.have.header(
            'content-type', 'application/json; charset=utf-8');
          expect(res.body.msg).to.equal("No token found");
          done();
        });
    });

  it('Has taken', (done) => {
    chai.request(app)
    .get('/resource')
    .set('Authorization', createToken(
        userAccountDb[1].username,
        userAccountDb[1].isAdmin,
        userAccountDb[1].permissions
        ))
    .end((err, res) => {
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res).to.have.header(
        'content-type', 'application/json; charset=utf-8');
      console.log(res.body);
      //expect(res.body.msg).to.equal("No token found");
      done();
    });
  });
});

describe('Post to Login /login', () => {
  it("Post to login use a exist account.", (done) => {
    chai.request(app)
      .post('/login')
      .send(userAccountDb[1])
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res).to.have.header(
          'content-type', 'application/json; charset=utf-8');
        expect(res.body).to.have.property("token");
        done();
      });
   });


  it("Post to login use a unexist account.", (done) => {
    chai.request(app)
      .post('/login')
      .send(
        {
          username: 'Tonia',
          password: 'tonpwd'
        }
      )
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(401);
        expect(res).to.be.json;
        expect(res).to.have.header(
          'content-type', 'application/json; charset=utf-8');
        expect(res.body.msg).to.equal('Invalid username or password');
        done();
      });
   });

});

describe('GET /admin_resource', () => {

  it(`
    Don't has token,
    and Content-Type header should be application/json
    `, (done) => {
      chai.request(app)
        .get('/admin_resource')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(401);
          expect(res).to.be.json;
          expect(res).to.have.header(
            'content-type', 'application/json; charset=utf-8');
          expect(res.body.msg).to.equal("No token found");
          done();
        });
    });

  it('Has taken', (done) => {
    chai.request(app)
    .get('/admin_resource')
    .set('Authorization', createToken(
        userAccountDb[0].username,
        userAccountDb[0].isAdmin,
        userAccountDb[0].permissions
        ))
    .end((err, res) => {
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res).to.have.header(
        'content-type', 'application/json; charset=utf-8');
      console.log(res.body);
      //expect(res.body.msg).to.equal("No token found");
      done();
    });
  });

  it(`
    User Don't has Admin token,
    and Content-Type header should be application/json
    `, (done) => {
      chai.request(app)
        .get('/admin_resource')
        .set('Authorization', createToken(
          userAccountDb[1].username,
          userAccountDb[1].isAdmin,
          userAccountDb[1].permissions
        ))
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(403);
          expect(res).to.be.json;
          expect(res).to.have.header(
            'content-type', 'application/json; charset=utf-8')
          //console.log(res.body);
          //console.log(res);
          expect(res.body.msg).to
          .equal("You are not authorized to access this resource");
          done();
        });
    });

});

describe('GET /a has permissions', () => {
  
   let token = null;

   it("Post to login use a exist account.", (done) => {
     chai.request(app)
      .post('/login')
      .send(userAccountDb[1])
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res).to.have.header(
          'content-type', 'application/json; charset=utf-8');
        expect(res.body).to.have.property("token");
        console.log("Token: ", res.body.token);
        token = res.body.token
        done();
      })
   })

  it(`
    Connect /a, hasn't token.
    `, (done) => {
      chai.request(app)
        .get('/a')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(401);
          expect(res).to.be.json;
          expect(res).to.have.header(
            'content-type', 'application/json; charset=utf-8');
          expect(res.body.msg).to.equal("No token found");
          done();
        });
    });
    
  it(`
    First login, then request /a .
    `, (done) => {
      chai.request(app)
        .get('/a')
        .set('Authorization', token )
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res).to.have.header(
            'content-type', 'application/json; charset=utf-8')
          console.log(res.body);
          //console.log(res);
          //expect(res.body.msg).to
          //.equal("You are not authorized to access this resource");
          done();
        });
    });
    
});

describe('GET /a has not permissions', () => {
  
   let token = null;

   it("Post to login use a exist account.", (done) => {
     chai.request(app)
      .post('/login')
      .send(userAccountDb[3])
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res).to.have.header(
          'content-type', 'application/json; charset=utf-8');
        expect(res.body).to.have.property("token");
        console.log("Token: ", res.body.token);
        token = res.body.token
        done();
      })
   })

  it(`
    First login, then request /a .
    `, (done) => {
      chai.request(app)
        .get('/a')
        .set('Authorization', token )
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(403);
          expect(res).to.be.json;
          expect(res).to.have.header(
            'content-type', 'application/json; charset=utf-8')
          console.log(res.body);
          expect(res.body.msg).to
          .equal("You are not authorized to access this resource.");
          done();
        });
    });

  it(`
    First login, then request /b .
    `, (done) => {
      chai.request(app)
        .get('/b')
        .set('Authorization', token )
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res).to.have.header(
            'content-type', 'application/json; charset=utf-8')
          console.log(res.body);
          //expect(res.body.msg).to
          //.equal("You are not authorized to access this resource.");
          done();
        });
    });
});

after( () => {
  dbHandler.closeDbConnection();
});
