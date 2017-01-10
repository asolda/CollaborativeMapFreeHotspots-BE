

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
var agent = chai.request.agent(server);
    /*
      * Testa la funzione di login e logout
      */
    describe('Crea e distrugge la sessione', () => {
        describe('Mantiene il cookie di sessione', () => {
            it('Crea una sessione(login)', function (done) {
                user.getid('testgophercmfh@gmail.com')
                .then(result =>{
                id=result;
                            });
                
                agent
                    .post('/user/login')
                    .send({ 'email': 'testgophercmfh@gmail.com', 'password': 'Cico1996' })
                    .then(res => {

                        expect(res.body).to.have.property('status', 0);
                        expect(res.body.message).to.have.property('user', id );
                       
    
                        done();
                    });
            });
        });

    describe('Elimina il cookie di sessione', () => {
            it('Elimina una sessione(logout)', function (done) {
               
                
                agent
                    .post('/user/logout')
                    
                    .then( res => {

                        expect(res.body).to.have.property('status', 0);
                        expect(res.body).to.have.property('message', 'LOGOUT_OK');
                       
    
                        done();
                    });
                    
            });
        });

    });
});
