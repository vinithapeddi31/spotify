const { expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { registerUser } = require('../controllers/registercontrol');
const User = require('../models/User');
const UserModel=require('../models/User');
describe('Authentication Controller', () => {
  describe('registerUser', () => {
    let findOneStub;
    let hashStub;
    let createStub;
    let resRenderStub;

    beforeEach(() => {
      findOneStub = sinon.stub(User, 'findOne');
      hashStub = sinon.stub(bcrypt, 'hash');
      createStub = sinon.stub(UserModel, 'create');
      resRenderStub = sinon.stub();

      const req = {
        body: {
          email: 'test@example.com',
          password: 'password123',
          firstName: 'John',
          lastName: 'Doe',
          username: 'johndoe',
        },
      };
      const res = { render: resRenderStub };

      findOneStub.withArgs({ email: req.body.email }).resolves(null);
      hashStub.withArgs(req.body.password, 10).resolves('$2b$10$yourGeneratedHashedPassword'); 
      createStub.resolves({
        ...req.body,
        _id: 'someId',
        toJSON: sinon.stub().returns({ ...req.body, _id: 'someId' }),
      });
    });

    afterEach(() => {
      sinon.restore();
    });

    it('should create a new user and render login page', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'password123',
          firstName: 'John',
          lastName: 'Doe',
          username: 'johndoe',
        },
      };
      const res = { render: resRenderStub };

      await registerUser(req, res);

      expect(createStub.calledOnce).to.be.true;
      expect(hashStub.calledOnce).to.be.true;
      expect(resRenderStub.calledOnce).to.be.true;
      expect(resRenderStub.firstCall.args[0]).to.equal('login');
    });

    it('should return 403 for existing user', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'password123',
          firstName: 'John',
          lastName: 'Doe',
          username: 'johndoe',
        },
      };
      const res = { status: sinon.stub().returns({ json: sinon.stub() }) };

      findOneStub.resolves({});

      await registerUser(req, res);

      expect(res.status.calledWith(403)).to.be.true;
      expect(res.status().json.calledWith({ error: 'User already exists' })).to.be.true;
    });

    it('should handle internal server error', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'password123',
          firstName: 'John',
          lastName: 'Doe',
          username: 'johndoe',
        },
      };
      const res = { status: sinon.stub().returns({ json: sinon.stub() }) };

      findOneStub.rejects(new Error('Some error'));

      await registerUser(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.status().json.calledWith({ error: 'Internal Server Error' })).to.be.true;
    });
  });
});
