

let connection = require("../connection");
let Pin = require('../models/pin');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');

let should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('Pins', () => {

    /*
      * Test the /GET route
      */
    describe('/GET Pin', () => {
        it('it should GET PINS list', (done) => {

            chai.request('http://localhost:8080')
                .get('/pin/get_networks/1/2/3/4')

                .end((err, res) => {
                    res.should.have.status(200);

                    res.should.have.header('content-type', 'text/html; charset=utf-8');
                    done();



                });
        });
    });

});