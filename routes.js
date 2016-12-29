// Models, MUST EDIT.
var user = require('./models/user');
var pin = require('./models/pin');
var segnala = require('./models/segnala');
var token = require('./models/token');

var config = require('./config');
var mailer = require('./mailer');

/*
sha1 encoding

var crypto = require('crypto');
console.log(crypto.createHash('sha1').update('email@boh.com').digest("hex"));
*/
 
module.exports = {
  configure: function(app) {
	  
	// localhost test at endpoint / for watch if node is working properly
    app.get('/', function(req, res) {
		res.end('If you reach this endpoint, then Node.js is working! :D');
	});

	app.post('/test_nodemailer/', function(req, res){
        mailer.transporter.sendMail({
            from: config.smtp_google_user,
            to: 'finalgalaxy@gmail.com',
            subject: 'Testsubj!',
            text: 'Testtext!'
        }, function (err, responseStatus){
            mailer.transporter.close();
        });
        res.send({status: 0});
    });
	
	
    app.post('/user/new/', function(req, res) {
        user.create(req.body, res);
    });
    
    app.post('/user/reset_password/request', function(req, res){
        user.reset_password_request(req.body, res);
    });
    
    app.get('/user/reset_password/token/:token/redirect/:redirect_url', function(req, res){
        console.log(req.params.token);
        token.check(req.params.token).then(token_got => {
           // res.send({status: 0, message: req.params.redirect_url+'?token='+token_got});
           var url_parsed = req.params.redirect_url.replace('%2F', '/');
           console.log(url_parsed);
           res.redirect('http://'+url_parsed+'?token='+token_got);
        }).catch(err => res.send({status: 1, message: 'ERROR_TOKEN'}));
    });
    
    app.get('/user/reset_password/token/:token/', function(req, res){
        token.check(req.params.token).then(token_gen => {
            res.send({status: 0, message: 'TOKEN_OK'});
        }).catch(token_gen => {
            res.send({status: 1, message: 'ERROR_TOKEN'});
        });
    });
    
    app.post('/user/reset_password/do/', function(req, res){
        // check esistenza del token
        token.get(req.params.token).then(token_data => {
            user.set_password(token_data.email, req.body.password);
        }).catch(err => {
            res.send({status: 1, message: 'ERROR_TOKEN'});
        });
        //user.set_password()
    });
    
    app.post('/user/login', function(req,res){
        var session_cookie=req.cookies.actoken32;
        if(session_cookie!=null || session_cookie==""){
            console.log('You cannot login, session already active on your browser');
            res.send({status: 1, message: 'CANNOT_LOGIN'});
        } else
        user.login(req.body, res);
    });
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
	// Endpoints. MUST EDIT, WORK IN PROGRESS.
    app.get('/user/', function(req, res) {
      user.get(res);
    });
 
 
    app.put('/user/', function(req, res) {
      user.update(req.body, res);
    });
	
	app.post('/pin/testcoordinates/', function(req, res) {
		pin.testpoint(req, res);
    });
	
	app.get('/pin/get_networks/:latitudine/:longitudine/:radius_lat/:radius_long', function(req, res){
		pin.getlistpin(req, res);
	});
    
    app.post('/segnala/', function(req, res){
        segnala.report(req, res);
    });
 
    app.delete('/user/:email/', function(req, res) {
      user.delete(req.params.email, res);
    });

    app.get('/user/search/:email/', function(req, res) {
      user.search(req.params.email, res);
    });
  }
};
