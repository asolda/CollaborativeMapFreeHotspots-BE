/*
test selenium, per eseguirlo usere cmd nightwatch --config nightwatch.conf.BASIC.js 
*/

var config = require('../nightwatch.conf.BASIC.js');

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
            .setValue('input#in-l-email.mdl-textfield__input', 'finalgalaxy@gmail.com');
            browser
            .setValue('input#in-l-password.mdl-textfield__input', 'test');
        browser.click('#enterbtna-login', function (response) {
            this
            .pause(3000)
                
                        .saveScreenshot('Login eseguito.png')
                        .end();



        });

    }
};