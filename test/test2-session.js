

let connection = require("../connection");
//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require("../app");
let should = chai.should();
connection.switch_db("test1");
let session = require("../models/session");
var expect = chai.expect;
chai.use(chaiHttp);
var Cookies;
//Our parent block
describe('Session', () => {

    /*
      * Testa la funzione di ricerca pin vicini
      */
    describe('Crea la sessione', () => {
        describe('restituisce il cookie di sessione', () => {
            it('Crea una sessione', function (done) {

                chai.request(server)
                    .post('/user/login')
                    .send({ 'email': 'Test1@gmail.com', 'password': 'Cico1996' })
                    .end((err, res) => {

                        expect(res.body).to.have.property('status', 0);
                        expect(res.body.message).to.have.property('user', 5 );
                       
    
                        done();
                    });
            });
        });


    });
});
