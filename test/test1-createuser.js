

let connection = require("../connection");
//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require("../app");
let should = chai.should();
connection.switch_db("test1");
let user = require("../models/user");
var expect = chai.expect;
chai.use(chaiHttp);
//Our parent block
describe('Create-User', () => {
    let userjson = { 'email': 'testgophercmfh@gmail.com', 'password': 'Cico1996' };
    /*
      * Testa la funzione di creazione richiesta utente
      */
    describe('Crea utente', () => {
        it('Crea la richiesta per l\'utente testgophercmfh@gmail.com', function (done) {

            chai.request(server)
                .post('/user/new/request')
                .send(userjson)

                .end((err, res) => {
                    expect(res.body).to.have.property('status', 0);

                    expect(res.body).to.have.property('message', 'REGISTRATION_REQUEST_OK');
                    done();
                });
        });
    });
    /*
* Testa la funzione di creazione utente
*/
    describe('Aggiunta di testgophercmfh@gmail.com al database.', (done) => {
        it('testa la creazione vera e propria di un utente', function (done) {
            user.create(userjson)
                .then(message_ok => {
                    done();

                });
        });

    });
});

