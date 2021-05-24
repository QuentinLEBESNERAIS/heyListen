var app = require("../app")
var request = require("supertest")

test("Sign-up Manager, plusieurs champs sont vides", async (done) => {
  await request(app).post('/users/sign-up-manager')
    .send({ lastName: 'Roger', firstName: 'Michel' })
    .expect(200)
    .expect({response: 'Merci de renseigner tous les champs'});
  done();
});