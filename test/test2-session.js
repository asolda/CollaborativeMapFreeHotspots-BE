

let connection = require("../connection");
//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require("../app");
let should = chai.should();
connection.switch_db("test1");
let user= require("../models/user");
var expect = chai.expect;
chai.use(chaiHttp);
var id;
//Our parent block
describe('Session', () => {

    /*
      * Testa la funzione di login
      */
    describe('Crea la sessione', () => {
        describe('restituisce il cookie di sessione', () => {
            it('Crea una sessione', function (done) {
                user.getid('Test1@gmail.com')
                .then(result =>{
                id=result;
                            });
                
                chai.request(server)
                    .post('/user/login')
                    .send({ 'email': 'Test1@gmail.com', 'password': 'Cico1996' })
                    .end((err, res) => {

                        expect(res.body).to.have.property('status', 0);
                        expect(res.body.message).to.have.property('user', id );
                       
    
                        done();
                    });
            });
        });


    });
});
