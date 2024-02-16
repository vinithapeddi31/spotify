const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../index.js"); // Replace with the actual path to your Express app

chai.use(chaiHttp);
const { expect } = chai;

describe("Auth Controller Tests", () => {
  it("should register a new user", async () => {
    const res = await chai
      .request(app)
      .post("/register")
      .send({
        email: "test@example.com",
        password: "test123",
        firstName: "Test",
        lastName: "User",
        username: "testuser",
      });

    expect(res).to.have.status(200);
    expect(res.text).to.include("Login");
  });


  it("should login an existing user", (done) => {
    chai
      .request(app)
      .post("/login")
      .send({
        email: "test@example.com",
        password: "test123",
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.include("Home");
        done();
      });
  });

});
