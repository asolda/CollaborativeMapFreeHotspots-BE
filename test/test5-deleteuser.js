

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
describe('Delete-User', () => {
    var agent = chai.request.agent(server);
    let userjson = { 'email': 'testgophercmfh@gmail.com', 'password': 'Cico1996' };
    /*
      * Testa la funzione di creazione richiesta utente
      */
    var tokens;
    describe('Elimina L\' utente', () => {
        it('Crea la richiesta per eliminare l\'utente testgophercmfh@gmail.com', function (done) {


            agent
                .post('/user/login')
                .send({ 'email': 'testgophercmfh@gmail.com', 'password': 'Cico1996' })
                .then((res) => {
                    expect(res).to.have.cookie('actoken32');


                    agent.post('/user/delete/request')
                        .send()
                        .then((res) => {
                            expect(res.body).to.have.property('status', 0);
                            expect(res.body).to.have.property('message', 'DELETE_REQUEST_OK');
                            done();
                        });
                });
        });
    });
    // Testa la funzione token checking

    describe('Controlla l\'esistenza del token', (done) => {
        it('Cerca il token nel database', function (done) {



            token.get_token_from_email('testgophercmfh@gmail.com')
                .then(result => {
                    tokens = result.token;
                    chai.request(server)
                        .get('/token/' + tokens + '/')

                        .end((err, res) => {
                            expect(res.body).to.have.property('status', 0);
                            expect(res.body).to.have.property('message', 'TOKEN_OK');
                            done();
                        });
                });
        });
    });


    // Testa la funzione di creazione utente

    describe('Elimina l\'utente testgophercmfh@gmail.com.', (done) => {
        it('testa l\'eliminazione vera e propria di un utente', function (done) {



            token.get_token_from_email('testgophercmfh@gmail.com')
                .then(result => {
                    tokens = result.token;
                    agent.post('/user/delete/do')
                        .send({ 'token': tokens })

                        .then((res) => {
                            expect(res.body).to.have.property('status', 0);
                          
                            done();
                        });
                });
        });
    });
});



