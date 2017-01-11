var config = require('./config');
var nodemailer = require('nodemailer');

function Mailer(){
    var transporter=null;
    
	this.init = function(){
		this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            //service: 'Gmail',
            auth: {
                user: config.smtp_google_user,
                pass: config.smtp_google_pass
            },
            logger: true
        });
    };
}
module.exports = new Mailer();
