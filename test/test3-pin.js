

let connection = require("../connection");
//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require("../app");
let should = chai.should();
connection.switch_db("test1");
var expect = chai.expect;
var id;
chai.use(chaiHttp);
//Our parent block
describe('Pins', () => {
    var agent = chai.request.agent(server);
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
         * Testa la funzione di inserimento pin usando l'agent per mantenere la sessione
         */
    describe('Inserimento rete', () => {

        it('Dovrebbe inserire il PIN', function (done) {

            let email = 'testgophercmfh@gmail.com';

            agent
                .post('/user/login')
                .send({ 'email': 'testgophercmfh@gmail.com', 'password': 'Cico1996' })
                .then((res) => {
                    id = res.body.message.user;

                    expect(res).to.have.cookie('actoken32');

                    return agent

                        .post('/pin/new')
                        .send({ 'ssid': 'Test1', 'qualità': 3, 'latitudine': 1, 'longitudine': 2, 'necessità_login': 0, 'restrizioni': 'Nessuna', 'altre_informazioni': 'PASS:Ciao', 'range': 20 })
                        .then((res) => {

                            expect(res.body).to.have.property('status', 0);
                            expect(res.body).to.have.property('message', 'INSERT_OK');
                            done();
                        });
                });

        });
    });
    var rete_id;
    describe('GET lista pin utente', () => {

        it('Restituisce la lista delle reti utente', function (done) {

            agent

                .get('/pin/get_user_networks/' + id + '/')

                .then((res) => {

                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.be.a('array');
                    expect(res.body[0]).to.have.property('ssid', 'Test1');
                    rete_id=res.body[0].id;
                    done();
                });
        });

    });
    describe('Update range rete', () => {

        it('Aggiornamento del PIN', function (done) {



            agent

                .post('/pin/edit')
                .send({ 'range': 30, 'rete_wifi':rete_id })
                .then((res) => {

                    expect(res.body).to.have.property('status', 0);
                    expect(res.body).to.have.property('message', 'EDIT_OK');
                    done();
                });
        });

    });
    describe('Elimina rete', () => {

        it('Elimina il PIN', function (done) {



            agent

                .post('/pin/delete')
                .send({ 'rete_wifi':rete_id })
                .then((res) => {

                    expect(res.body).to.have.property('status', 0);
                    expect(res.body).to.have.property('message', 'DELETE_OK');
                    done();
                });
        });

    });
    var rand= function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}
var rand_value=rand(1,6) ;
    describe('Valuta la rete di testing con valore randomico: '+rand_value, () => {

        it('valuta la rete \'retetest\'', function (done) {



            agent

                .post('/pin/rank')
                .send({ 'rete_wifi':1, voto:rand_value })
                .then((res) => {

                    expect(res.body).to.have.property('status', 0);
                    expect(res.body).to.have.property('message', 'RANKING_OK');
                    done();
                });
        });

    });
    describe('Richiedi dettagli rete di testing', () => {

        it('Riceve dettagli della rete \'retetest\'', function (done) {



             chai.request(server)

                .get('/pin/getPinInfo/1')
                
                .then((res) => {
                    expect(res.body).to.have.property('status', 0);
                    expect(res.body.message[0]).to.have.property('ssid', 'retetest');
                    done();
                });
        });

    });
});


