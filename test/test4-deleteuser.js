

let connection = require("../connection");
//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require("../app");
let should = chai.should();
connection.switch_db("test1");
let user = require("../models/user");
var expect = chai.expect;
let token = require("../models/token");
chai.use(chaiHttp);
//Our parent block
describe('User', () => {
    var agent = chai.request.agent(server);
    let userjson = { 'email': 'Test1@gmail.com', 'password': 'Cico1996' };
    /*
      * Testa la funzione di creazione richiesta utente
      */
    describe('Elimina L\' utente', () => {
        it('Crea la richiesta per eliminare l\'utente Test1@gmail.com', function (done) {
            var tokens;
before(function() {
    // runs before all tests in this block
 
          
                 });
            
            agent
                .post('/user/login')
                .send({ 'email': 'Test1@gmail.com', 'password': 'Cico1996' })
                .then((res) => {
                    expect(res).to.have.cookie('actoken32');
                    
                  return
                    agent.post('/user/delete/request')
                        .send({ 'email': 'Test1@gmail.com', 'password': 'Cico1996' })
                        .then((res) => {
                            token.get_token_from_email('Test1@gmail.com')
                            .then(result => {
                                tokens=result;
                                console.log(tokens);
                            }); 
                        
                            return

                            agent.post('/user/delete/do')
                                .send(tokens)
                   
                                .then((res) => {
                                    expect(res.body).to.have.property('status', 0);
                                    expect(res.body).to.have.property('message', message_ok);
                                    done();
                                }).catch(err =>{

                                console.log(err);

                           });
                        });
                });
        });
    });
});
    /*
* Testa la funzione di creazione utente
 
    describe('Elimina l\'utente Test1@gmail.com.', (done) => {
        it('testa la creazione vera e propria di un utente', function (done) {
            agent
                .post('/user/delete/request')
                .send({ 'email': 'Test1@gmail.com', 'password': 'Cico1996' })
                .then((res) => {
                    
                    return agent

                        .post('/user/delete/request')
                        .then((res) => {

                            expect(res.body).to.have.property('status', 0);
                            expect(res.body).to.have.property('message', 'DELETE_REQUEST_OK');
                            done();
                        });
                });
        });
    });

 */
