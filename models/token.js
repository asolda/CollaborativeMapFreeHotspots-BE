var connection = require('../connection');
var crypto = require('crypto');
var Promise = require('promise');


function Token(){
	this.generate = function(email){
        //http://stackoverflow.com/a/28433034
        return new Promise((resolve, reject) => {
            connection.acquire(function(err, con){
                var token_generated=true;
                var token = 'TEMP'+crypto.createHash('sha1').update(email).digest("hex");
                con.query('INSERT INTO token (token, email, creation_time) VALUES (?, ?, ?)', [token, email, (new Date().getTime()/1000)], function(err, result){
                    if(err){
                        con.query('UPDATE token SET token = ?, creation_time = ? WHERE email = ?', [token, (new Date().getTime()/1000), email], function(err, result){
                            con.release();
                            if(err) {
                                reject(err);
                            }else{
                                resolve(token);
                            }
                        });
                    }else{
                        con.release();
                        reject(err);
                    }
                });
            });
        });
    }
    
    this.check = function(token){
        return new Promise((resolve, reject) => {
            connection.acquire(function(err, con){
                con.query('SELECT COUNT(token) FROM token WHERE token = ?', [token], function(err, result){
                    con.release();
                    if(err){
                        reject(err);
                    }else{
                        if(result[0].n_found > 0){
                            resolve(token);
                        }else{
                            reject(err);
                        }
                    }
                });
            });
        });
    }
    
    this.get = function(token){
        return new Promise((resolve, reject) => {
            connection.acquire(function(err, con){
                con.query('SELECT email, token FROM token WHERE token = ?', [token], function(err, result){
                    con.release();
                    if(err){
                        reject(err);
                    }else{
                        if(result[0].n_found > 0){
                            resolve(result);
                        }else{
                            reject(err);
                        }
                    }
                });
            });
        });
    }
    
    this.delete = function(token){
        connection.acquire(function(err, con){
            con.query('DELETE FROM token WHERE token = ?', [token], function(err, result){
                con.release();
                if(err){
                    reject(err);
                }else{
                    resolve(token);
                }
            });
        });
    }
       /* var token_generated=true;
        var token=null;
		connection.acquire(function(err, con){
            token = 'TEMP'+crypto.createHash('sha1').update(email).digest("hex");
            con.query('INSERT INTO token (token, email, creation_time) VALUES (?, ?, ?)', [token, email, (new Date().getTime()/1000)], function(err, result){
                if(err){
                    //console.log(err);
                    con.query('UPDATE token SET token = ?, creation_time = ? WHERE email = ?', [token, (new Date().getTime()/1000), email], function(err, result){
                        if(err) {console.log(err);token_generated=false;}
                    });
                }
                con.release();
            });
            if(token_generated==true) {console.log(token);return token;}
            else                return null;
		});*/
		//res.send({status: 0, message: 'All OK', latitude: req.body.latitude, longitude: req.body.longitude});
  
}
module.exports = new Token();
