

let connection = require("../connection");
//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require("../app");
let should = chai.should();
connection.switch_db("test1");

var expect = chai.expect;
let token = require("../models/token");
chai.use(chaiHttp);
//Our parent block
describe('Password', () => {
    var agent = chai.request.agent(server);

    /*
      * Testa la funzione di reimpostazione pass
      */
    var tokens;
    describe('Testa le richieste  della reimpostazione pass', () => {
        it('Crea la richiesta per reset password', function (done) {


            chai.request(server)
                .post('/user/reset_password/request')
                .send({ 'email': 'testgophercmfh@gmail.com' })
                .then((res) => {


                    expect(res.body).to.have.property('status', 0);
                    expect(res.body).to.have.property('message', 'RESET_REQUEST_OK');
                    done();
                });
        });
    });

    // Testa la funzione di reset pass

    describe('Testa la reimpostazione pass', () => {
        it('Reimposta la password', function (done) {



            token.get_token_from_email('testgophercmfh@gmail.com')
                .then(result => {
                    tokens = result.token;
                    chai.request(server)
                        .post('/user/reset_password/do/')
                        .send({ 'token': tokens, 'email': 'testgophercmfh@gmail.com', 'password': 'Cico1996' })
                        .then(res => {
                            expect(res.body).to.have.property('status', 0);
                            expect(res.body).to.have.property('message', 'PASSWORD_UPDATED');
                            done();
                        });
                });
        });
    });

});









