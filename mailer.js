var config = require('./config');
var nodemailer = require('nodemailer');

function Mailer(){
    var transporter=null;
    
	this.init = function(){
		this.transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: config.smtp_google_user,
                pass: config.smtp_google_pass
            }
        });
    };
}
module.exports = new Mailer();
