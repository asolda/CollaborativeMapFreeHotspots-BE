/*
test selenium, per eseguirlo usere cmd nightwatch --config nightwatch.conf.BASIC.js 
*/
let chai = require('chai');
let chaiHttp = require('chai-http');
var config = require('../nightwatch.conf.BASIC.js');
let user = require("../models/user");
chai.use(chaiHttp);
let server = require("../app");
var agent = chai.request.agent(server);
module.exports = { // adapted from: https://git.io/vodU0
    'Check page displaying': function (browser) {
        browser
            .url('http://localhost/CollaborativeMapFreeHotspots-FE')
            .waitForElementVisible('body')
            .assert.title('Alwaysconnected: collaborative map of free hotspot')
            .saveScreenshot('Check_caricamento.png');
    },
    'Check map displaying': function (browser) {
        browser
            .expect.element('#map').to.be.present;
        browser.waitForElementVisible('#map>div>div.gm-style>div>div>div>div>div.gm-style-iw>div>div', 15000, function () {
            // do something while we're here

            this
                .assert.containsText("#map>div>div.gm-style>div>div>div>div>div.gm-style-iw>div>div", "Tu sei qui");
            this

                .saveScreenshot('Mappa.png');
        });
    },
    'Check registration function present': function (browser) {
        // browser.pause(500);
        browser
            .expect.element('#show-signup').to.be.present;
        browser.click('#show-signup', function (response) {
            this
                .waitForElementVisible('#dialog-signup', 3000, function () {
                    // do something while we're here

                    this
                        .saveScreenshot('signup.png');
                });
        });
    },
    'Register a user': function (browser) {
        // browser.pause(500);
        browser
            .setValue('input#in-r-email.mdl-textfield__input', 'Testfront1@gmail.com');
        browser
            .setValue('input#in-r-password.mdl-textfield__input', 'Cico1996');
        browser
            .setValue('input#in-r-confermapassword.mdl-textfield__input', 'Cico1996');
        browser.click('#enterbtn-signup', function (response) {
            browser
                .pause(3000)

                .saveScreenshot('Registrazione eseguita.png');
            browser
                .expect.element('#closebtn-signupBis').to.be.present;
            browser.click('#closebtn-signupBis', function (response) {

                /*     token.get_token_from_email('Testfront1@gmail.com')
                 .then(result => {
                     console.log('result.token = ' + result.token);
                     chai.request('http://localhost:8080/').get('/user/new/do/token/' + result.token + '/email/' + 'Testfront1@gmail.com' + '/password/' + 'Cico1996' + '/'+'www.google.it/')
                         
     
                         .then((res) => {
                            
                         }).catch(err =>{
                             console.log('err='+err);
                         });
                 });*/
                user.create({ 'email': 'Testfront1@gmail.com', 'password': 'Cico1996' })
                    .then(message_ok => {
                        done();

                    });
            });
        });
    },
    'Check login function present': function (browser) {
        // browser.pause(500);
        browser
            .expect.element('#show-login').to.be.present;
        browser.click('#show-login', function (response) {
            this
                .waitForElementVisible('#dialog-login', 3000, function () {
                    // do something while we're here

                    this
                        .saveScreenshot('Login.png');
                });
        });
    },
    'Login a user': function (browser) {
        // browser.pause(500);
        browser
            .setValue('input#in-l-email.mdl-textfield__input', 'Testfront1@gmail.com');
        browser
            .setValue('input#in-l-password.mdl-textfield__input', 'Cico1996');
        browser
            .expect.element('#enterbtna-login').to.be.present;

        browser.click('#enterbtna-login', function (response) {
            this
                .pause(3000)

                .saveScreenshot('Login eseguito.png');
        });

    },
    'Check funzione aggiunta rete': function (browser) {
        // browser.pause(500);
        browser
            .waitForElementVisible('#show-addwifi', 3000, function () {

                this.click('#show-addwifi', function (response) {
                    this
                        .waitForElementVisible('#dialog-askinsertwifimode', 5000, function () {
                            this
                                .expect.element('#myposition-askinsertwifimode').to.be.present;

                            this.saveScreenshot('Dialog rete.png');
                        });
                });
            });
    },
    'Aggiunta rete wifi': function (browser) {
        // browser.pause(500);
        browser.pause(5000);
        browser.click('#myposition-askinsertwifimode', function (response) {
            this
                .waitForElementVisible('#dialog-insertnewwifi', 5000, function () {
                    this
                        .expect.element('#enterbtn-insertnewwifi').to.be.present;
                    this
                        .setValue('#insert-nomerete>input', 'TestRete');

                    this
                        .setValue('#insert-restrizioni>input', 'Nessuna');
                    this.moveToElement('#enterbtn-insertnewwifi', 10, 10);
                    this.pause(3000);
                    this
                        .setValue('#insert-range>input', '20');
                    this
                        .setValue('#insert-altreinfo>textarea', 'Ciao');
                    this.click('#insert-quality > ul > li:nth-child(2)', function (response) {
                        this.click('#enterbtn-insertnewwifi', function (response) {
                            this.saveScreenshot('Dialog rete posizione corrente.png');

                            this.click('#closebtn-insertnewwifi', function (response) {
                                this.click('#map > div > div > div.gmnoprint.gm-bundled-control.gm-bundled-control-on-bottom > div:nth-child(1) > div > div:nth-child(1)', function (response) {




                                    this.pause(1000);
                                    this.saveScreenshot('Rete inserita.png');


                                  

                                });
                            });
                        });
                    });
                });
        });
    },

    'Check lista reti utente': function (browser) {
        // browser.pause(500);


        browser.moveToElement('#tooltipApriMenu',10,10);
            browser.mouseButtonClick('left', function(){

            
            browser
                .waitForElementVisible('#user-drawer', 5000, function () {
                    browser
                        .expect.element('#show-mywifi').to.be.present;

                    browser.saveScreenshot('Pannello utente.png');
                    this.click('#show-mywifi', function (response) {
                        this.expect.element('#dialog-mywifi').to.be.present;
                       this.saveScreenshot('Dialog reti wifi.png');
                        this
                            .assert.containsText(" #nomeRete1 > span.mdl-list__item-primary-content > span:nth-child(2)", "TestRete");
                    this.end();
 });
               });

        });
    }

};