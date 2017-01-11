/*
test selenium, per eseguirlo usere cmd nightwatch --config nightwatch.conf.BASIC.js 
*/

var config = require('../nightwatch.conf.BASIC.js');
let user = require("../models/user");
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

        user.create({ 'email': 'Testfront1@gmail.com', 'password': 'Cico1996' })
            .then(message_ok => {


            });
        browser.click('#enterbtn-signup', function (response) {
            this
                .pause(3000)

                .saveScreenshot('Registrazione eseguita.png')
            browser.click('#closebtn-signupBis', function (response) {
                


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
        browser.click('#enterbtna-login', function (response) {
            this
                .pause(3000)

                .saveScreenshot('Login eseguito.png')
                .end();



        });

    }
    
};