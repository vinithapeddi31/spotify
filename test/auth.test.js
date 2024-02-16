const { expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { loginUser } = require('../controllers/logincontrol');
const User = require('../models/User');
const Song = require('../models/Song');

describe('Authentication Controller', () => {
  describe('loginUser', () => {
    let findOneStub;
    let compareStub;
    let findStub;
    let renderStub;

    beforeEach(() => {
      findOneStub = sinon.stub(User, 'findOne');
      compareStub = sinon.stub(bcrypt, 'compare');
      findStub = sinon.stub(Song, 'find');
      renderStub = sinon.stub();

      const req = {
        body: {
          email: 'test@example.com',
          password: 'password123',
        },
      };
      const res = {
        status: sinon.stub().returns({ json: renderStub, render: renderStub }),
        render: renderStub,
      };
      async function generateHashedPassword() {
        const password = 'password123'; 
      
        try {
          const saltRounds = 10; 
          const hashedPassword = await bcrypt.hash(password, saltRounds);
      
          return hashedPassword;
        } catch (error) {
          console.error('Error generating hashed password:', error);
        }
      }
      
      const hashedPassword=generateHashedPassword();
      const fakeUser = {
        firstName: 'John',
        password: hashedPassword, 
        toJSON: sinon.stub().returns({ firstName: 'John' }),
      };

      findOneStub.withArgs({ email: req.body.email }).resolves(fakeUser);
      compareStub.withArgs(req.body.password, fakeUser.password).resolves(true);
      findStub.resolves([{ _id: 'song1', name: 'Song 1', artist: 'Artist 1' }]);
    });

    afterEach(() => {
      sinon.restore();
    });

    it('should render home page with user information and songs', async () => {
      const req = { body: { email: 'test@example.com', password: 'password123' } };
      const res = {
        render: sinon.stub(),
      };

      await loginUser(req, res);

      expect(res.render.calledOnce).to.be.true;
      expect(res.render.firstCall.args[0]).to.equal('home');
      expect(res.render.firstCall.args[1]).to.have.property('username', 'John');
      expect(res.render.firstCall.args[1].songs).to.be.an('array').that.is.not.empty;
    });

    it('should return 403 for invalid login credentials', async () => {
      const req = { body: { email: 'invalid@example.com', password: 'wrongPassword' } };
      const res = { status: sinon.stub().returns({ json: sinon.stub() }) };

      findOneStub.resolves(null);

      await loginUser(req, res);

      expect(res.status.calledWith(403)).to.be.true;
      expect(res.status().json.calledWith({ error: 'Invalid login credentials' })).to.be.true;
    });

    it('should return 403 for incorrect password', async () => {
      const req = { body: { email: 'test@example.com', password: 'wrongPassword' } };
      const res = { status: sinon.stub().returns({ json: sinon.stub() }) };

      compareStub.resolves(false);

      await loginUser(req, res);

      expect(res.status.calledWith(403)).to.be.true;
      expect(res.status().json.calledWith({ error: 'Invalid login credentials' })).to.be.true;
    });

    it('should handle internal server error', async () => {
      const req = { body: { email: 'test@example.com', password: 'password123' } };
      const res = { status: sinon.stub().returns({ json: sinon.stub() }) };

      findOneStub.rejects(new Error('Some error'));

      await loginUser(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.status().json.calledWith({ error: 'Internal Server Error' })).to.be.true;
    });
  });
});
