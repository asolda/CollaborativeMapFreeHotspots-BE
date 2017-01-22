// Models, MUST EDIT.
var user = require('./models/user');
var pin = require('./models/pin');
var segnala = require('./models/segnala');
var token = require('./models/token');
var session = require('./models/session');
var uuid=require('node-uuid');
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
    
    //testato
    // Verifica dell'esistenza del token nel DB (usato dagli scripts di preload in caso di ?token=TOKEN_VALUE).
    app.get('/token/:token/', function(req, res){
        token.check(req.params.token).then(token_gen => {
            res.send({status: 0, message: 'TOKEN_OK'});
        }).catch(err => {
            res.send({status: 1, message: 'ERROR_TOKEN'});
        });
    });
	
    
    
    //testato
    // Endpoint per richiedere l'inserimento di un nuovo utente (success: invio mail, gen. token).
    // @params email, password, frontend_url
    app.post('/user/new/request', function(req, res) {
        user.create_user_request(req.body, res);
    });
    
    // Endpoint, link inviato nella mail, per inserire un nuovo utente nel DB (success: creazione nuova riga in utente).
    // @params token, email, password, redirect_url
    app.get('/user/new/do/token/:token/email/:email/password/:password/redirect/:redirect_url', function(req, res) {
        console.log("params"+JSON.stringify(req.params));
        token.check(req.params.token).then(token_gen => {
            token.delete(req.params.token).then(token_deleted => {
                user.create_do_request(req.params, res);
            }).catch(err => {
                res.send({status: 1, message: 'ERROR_TOKEN'});
            });
        }).catch(err => {
            res.send({status: 1, message: 'ERROR_TOKEN'});
        });
    });
    
    //testato
    // Endpoint per richiedere il recupero della propria password (success: invio mail, gen. token).
    // @params email, frontend_url
    app.post('/user/reset_password/request', function(req, res){
        user.reset_password_request(req.body, res);
    });
    
    // Endpoint, link inviato nella mail, per permettere la reimpostazione della password nel caso il token sia valido (success: redirect alla home con ?token=TOKEN_VALUE).
    // Nella homepage, grazie all'aggiunta di ?action=RESET_PASSWORD&token=TOKEN_VALUE, verrà inviata un'ulteriore richiesta sull'endpoint /token/:token per check sulla validità del token.
    // @params token, redirect_url
    app.get('/user/reset_password/token/:token/redirect/:redirect_url', function(req, res){
        var url_parsed = decodeURIComponent(req.params.redirect_url);
        token.check(req.params.token).then(token_got => {
           res.redirect(url_parsed+'?action=RESET_PASSWORD&token='+token_got);
        }).catch(err => res.redirect(url_parsed));
    });
    //testato
    // Endpoint utilizzato per modificare la password, in caso in cui NON si è loggati (recupero), dopo aver confermato l'operazione (success: password modificata).
    // @params token, password
    app.post('/user/reset_password/do/', function(req, res){
        token.get(req.body.token).then(token_data => {
            token.delete(req.body.token).then(token_deleted => {
                user.set_password_do_request(token_data.email, req.body.password, res);
            }).catch(err => {
                res.send({status: 1, message: 'ERROR_TOKEN'});
            });
        }).catch(err => {
            res.send({status: 1, message: 'ERROR_TOKEN'});
        });
    });
    //testato
    // Endpoint utilizzato per modificare la password, in caso in cui si è loggati (modifica), dopo aver confermato l'operazione (success: password modificata).
    // @params password, utente (tramite la sessione)
    app.post('/user/change_password/', function(req, res){
        session.check(req.cookies.actoken32).then(user_id =>{
            user.get(user_id).then(data => {
                user.set_password(data.email, req.body.password).then(message_ok => {
                    res.send({status: 0, message: message_ok});
                }).catch(message_err => {
                    res.send({status: 1, message: message_err});
                });
            })
        }).catch(err => {
            res.send({status: 1, message: 'ERROR_SESSION'});
        });
    });
    //testato
    // Endpoint per richiedere l'eliminazione dell'account (success: invio mail, gen. token).
    // @params password, frontend_url, utente (tramite la sessione)
    app.post('/user/delete/request', function(req, res){
        session.check(req.cookies.actoken32).then(user_id =>{
            user.delete_request(user_id, req.body, res);
        }).catch(err => {
            res.send({status: 1, message: 'ERROR_SESSION'});
        });
    });
    
    // Endpoint, link inviato nella mail, per permettere l'eliminazione dell'account nel caso il token sia valido (success: redirect alla home con ?action=DELETE_USER&token=TOKEN_VALUE).
    // Nella homepage, grazie all'aggiunta di tale 'query', verrà inviata un'ulteriore richiesta sull'endpoint /token/:token per check sulla validità del token.
    // @params token, redirect_url 
    app.get('/user/delete/token/:token/redirect/:redirect_url', function(req, res){
        var url_parsed = decodeURIComponent(req.params.redirect_url);
        token.check(req.params.token).then(token_got => {
           res.redirect(url_parsed+'?action=DELETE_USER&token='+token_got);
        }).catch(err => res.redirect(url_parsed));
    });

    //testato
    // Endpoint utilizzato per eliminare l'account dopo aver confermato l'operazione (success: password modificata).
    // @params token, utente (cookie)
    app.post('/user/delete/do/', function(req, res){
        session.check(req.cookies.actoken32).then(user_id =>{
            token.get(req.body.token).then(token_data => {
                token.delete(req.body.token).then(token_deleted => {
                    user.delete_do_request(user_id, res);
                }).catch(err => {
                    res.send({status: 1, message: 'ERROR_TOKEN'});
                });
            }).catch(err => {
                res.send({status: 1, message: 'ERROR_TOKEN'});
            });
        }).catch(err => {
            res.send({status: 1, message: 'ERROR_SESSION'});
        });
    });
    //testato
    app.post('/user/login', function(req,res){
        var session_cookie=req.cookies.actoken32;
        session.check(session_cookie).then(utente =>{
            res.send({status: 1, message: 'CANNOT_LOGIN'});
        }).catch(error =>{
            if(session_cookie!=undefined||session_cookie!=null) res.clearCookie('actoken32');
            user.authorize(req.body).then(user_id => {
            var ip_client = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            var user_agent = req.headers['user-agent'] || 'Unknown';
            session.create(user_id, ip_client, user_agent).then(token=>{
                res.cookie('actoken32', token, { maxAge: 900000, httpOnly: true }); //maxage dovrebbe essere infinito, per ora settato a 900000
                res.send({status: 0, message: {user: user_id}});
            }).catch(err=>{
                res.send({status: 1, message: 'ERROR_GENERATING_SESSION'});
            });
        }).catch(message_err => {
            res.send({status: 1, message: message_err});
            });
        });           
    });
    //testato
    app.post('/user/logout', function(req,res){
        var session_cookie=req.cookies.actoken32;
        session.check(session_cookie).then(utente =>{
            session.drop(session_cookie).then(id => {
                res.clearCookie('actoken32');
                res.send({status: 0, message: 'LOGOUT_OK'});
            }).catch(message_err => {
                res.send({status: 1, message: message_err});
            });
        }).catch(message_err => {
            res.send({status: 1, message: message_err});
        });
    });
    //testato
    app.get('/session/check', function(req, res){
        console.log("cookie contains: "+JSON.stringify(req.cookies.actoken32));
        session.check(req.cookies.actoken32).then(user_id =>{
            res.send({status:0, message:{user: user_id}});
        }).catch(err=>{
            res.send({status: 1, message: err.message||err});
        });
    });
    
    app.post('/segnala/', function(req, res){
        session.check(req.cookies.actoken32).then(user_id =>{
            segnala.report(user_id, req, res);
        }).catch(err=>{
            res.send({status: 1, message: err.message||err});
        });
    });
    
    app.get('/segnala/notifications', function(req, res){
        session.check(req.cookies.actoken32).then(user_id =>{
            segnala.notifications(user_id, res);
        }).catch(err=>{
            res.send({status: 1, message: err.message||err});
        });
    });
    
    app.get('/segnala/notifications/amount/', function(req, res){
        session.check(req.cookies.actoken32).then(user_id =>{
            segnala.check_num_notifications(user_id, res);
        }).catch(err=>{
            res.send({status: 1, message: err.message||err});
        });
    });
    
    app.post('/segnala/notifications/watch/', function(req, res){
        session.check(req.cookies.actoken32).then(user_id =>{
            segnala.notification_watched(user_id, req.body, res);
        }).catch(err=>{
            res.send({status: 1, message: err.message||err});
        });
    });
    
    //testato
    // Endpoint per visualizza dettagli pin WiFi (success: dati della rete WiFi in JSON).
    // @params id
    app.get('/pin/getPinInfo/:pin_id', function(req, res){
        pin.get(req.params.pin_id).then(result => {
            res.setHeader('Content-Type', 'application/json');
            res.send({status: 0, message: result});
        }).catch(message_err => {
            res.send({status: 1, message: message_err});
        })
    });
    //testato
    // Endpoint per visualizza mappa (success: lista di reti WiFi con le informazioni utili per la mappa in JSON).
    // @params latitudine, longitudine, radius_lat, radius_long
    app.get('/pin/get_networks/:latitudine/:longitudine/:radius_lat/:radius_long', function(req, res){
		pin.getlistpin(req, res);
	});
    
    
    // Endpoint per gestione reti WiFi (success: lista di reti WiFi create dall'utente.
    // @params utente (tramite la sessione)
    app.get('/pin/get_user_networks/', function(req, res){
        session.check(req.cookies.actoken32).then(user_id=> {
            pin.getuserpins(user_id, res);
        }).catch(message_err=>{
            res.send({status: 1, message: message_err});
        });  
    });
    
    //testato
    // Endpoint per inserire un nuovo pin (success: creazione riga in rete_wifi nel DB).
    // @params ssid, qualità, latitudine, longitudine, necessità_login, restrizioni, altre_informazioni, range, utente (tramite la sessione)
    app.post('/pin/new', function(req, res){
        session.check(req.cookies.actoken32).then(user_id=> {
            pin.insert(user_id, req.body).then(message_ok => {
                res.send({status: 0, message: message_ok});
            }).catch(message_err => {
                res.send({status: 1, message: message_err});
            });
        }).catch(message_err=>{
            res.send({status: 1, message: message_err});
        });           
    });
    //testato
    // Endpoint per modificare un pin esistente.
    // @params rete_wifi, range, restrizioni, altre_informazioni, utente (tramite la sessione)
    app.post('/pin/edit', function(req, res){
        session.check(req.cookies.actoken32).then(user_id=> {
            pin.edit(user_id, req.body).then(message_ok => {
                res.send({status: 0, message: message_ok});
            }).catch(message_err => {
                res.send({status: 1, message: message_err});
            });
        }).catch(message_err=>{
            res.send({status: 1, message: message_err});
        }); 
    });
    //testato
    // Endpoint per valutare un pin esistente di cui NON si è proprietari.
    // @params rete_wifi, voto, [utente (da cambiare in sessione)]
    app.post('/pin/rank', function(req, res){
        session.check(req.cookies.actoken32).then(user_id=> {
            pin.rank(user_id, req.body).then(message_ok => {
                res.send({status: 0, message: message_ok});
            }).catch(message_err => {
                res.send({status: 1, message: message_err});
            });
        }).catch(message_err=>{
            res.send({status: 1, message: message_err});
        }); 
    });
    //testato
    // Endpoint per cancellare un pin esistente.
    // @params rete_wifi, [utente (da cambiare in sessione)]
    app.post('/pin/delete', function(req, res){
        session.check(req.cookies.actoken32).then(user_id=> {
            pin.delete(user_id, req.body).then(message_ok => {
                res.send({status: 0, message: message_ok});
            }).catch(message_err => {
                res.send({status: 1, message: message_err});
            });
        }).catch(message_err=>{
            res.send({status: 1, message: message_err});
        }); 
    });
  }
};
