
//Per far partire questa routine lanciare il comando ./node_modules/.bin/mocha integrationcomplete.js
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require("../app");
let should = chai.should();

var expect = chai.expect;
var id;
let user=require("../models/user");
chai.use(chaiHttp);
//Our parent block
describe('Testa le modifiche apportate in front end', () => {
    var agent = chai.request.agent(server);
    /*
      * Testa la funzione di ricerca pin vicini
      */
    describe('Controlla l\'esistenza dell\'utente creato in fase di front testing', () => {
        it('L\'utente Testfront1@gmail.com esiste', function (done) {

            agent
                .post('/user/login')
                .send({ 'email': 'Testfront1@gmail.com', 'password': 'Cico1996' })
                .then((res) => {
                    id = res.body.message.user;

                    expect(res.body).to.have.property('status', 0);
                    done();
                });

        });
    });
    /*
         * Testa la funzione di inserimento pin usando l'agent per mantenere la sessione
         */
    describe('Testa l\'esistenza della rete inserita dall\'utente', () => {

        it('La rete TestRete esiste', function (done) {

            agent

                .get('/pin/get_user_networks/' + id + '/')

                .then((res) => {

                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.be.a('array');

                    expect(res.body[0].ssid).to.be.equal('TestRete');
                    rete_id = res.body[0].id;
                    user.delete(id)
                        .then(res => {
                            done();
                        });

                });


        });
    });
});