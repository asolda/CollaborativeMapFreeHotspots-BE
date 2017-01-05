

let connection = require("../connection");
//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require("../app");
let should = chai.should();
connection.switch_db("test1");
var expect = chai.expect;
let user = require("../models/user");
chai.use(chaiHttp);
//Our parent block
describe('Pins', () => {

    /*
      * Testa la funzione di ricerca pin vicini
      */
    describe('/GET Pin', () => {
        it('Riceve la lista dei PIN wi-fi con parametri 1-2-3-4', function (done) {

            chai.request(server)
                .get('/pin/get_networks/1/2/3/4')

                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.be.a('array');
                    done();
                });
        });

    });
    /*
         * Testa la funzione di inserimento
         */
    describe('Inserimento rete', () => {
        describe('Test con rete: { \'ssid\': \'Test1\', \'qualità\': 3, \'latitudine\': 1, \'longitudine\': 2, \'necessità_login\': 0, \'restrizioni\': \'Nessuna\', \'altre_informazioni\': \'PASS:Ciao\', \'range\': 20, \'utente\': 1 }', () => {
            it('Dovrebbe inserire il PIN', function (done) {
                var agent = chai.request.agent(server);
                let email='Test1@gmail.com';
                let id ;
                agent
                    .post('/user/login')
                    .send({ 'email': 'Test1@gmail.com', 'password': 'Cico1996' })
                    .then((res) => {
                        expect(res).to.have.cookie('actoken32');
                        user.getid(email)
                        .then((result) =>{
                            
                            id = result;
                        }).catch(err => {
                res.send({status: 1, message: err});
            });
                       

console.log(id);
                        return agent

                            .post('/pin/new')
                            .send({ 'ssid': 'Test1', 'qualità': 3, 'latitudine': 1, 'longitudine': 2, 'necessità_login': 0, 'restrizioni': 'Nessuna', 'altre_informazioni': 'PASS:Ciao', 'range': 20, 'utente': id })
                            .then((res) => {
                            
                                expect(res.body).to.have.property('status', 0);
                                expect(res.body).to.have.property('message', 'INSERT_OK');
                                done();
                            });
                    });
            });

        });
    });
});