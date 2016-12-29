

let connection = require("../connection");
//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require("../app");
let should = chai.should();
connection.switch_db("test1");
var expect = chai.expect;
chai.use(chaiHttp);
//Our parent block
describe('Pins', () => {

    /*
      * Test the /GET route
      */
    describe('/GET Pin', () => {
        it('it should GET PINS list', function (done) {

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

});