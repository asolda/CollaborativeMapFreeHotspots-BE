var connection = require('../connection');
var crypto = require('crypto');
var Promise = require('promise');
var uuid=require('node-uuid');

function Session(){
    
    this.create=function(userId, ipaddress, user_agent){  
        var token=crypto.createHash('sha256').update(uuid.v1()).update(crypto.randomBytes(256)).digest("hex");//crea il token senza possibilità di collisioni     
        return new Promise((resolve,reject)=>{
            connection.acquire(function(err,con){
                con.query('INSERT INTO sessione (session_id, user_agent, utente, ultimo_accesso, indirizzo_ip) values(?,?,?,?,?)', [token, user_agent, userId, (new Date().getTime()), ipaddress],function(err, result){
                    con.release();
                    if(err){
                        reject(err);
                    } else resolve(token);
                });
            });
        });
    }
    
   
    this.drop=function(id){
         return new Promise((resolve,reject)=>{
            connection.acquire(function(err, con){
                con.query('DELETE FROM sessione WHERE session_id= ?', [id], function(err, result){
                    con.release();
                    if(err){
                        reject(err);
                    }else{
                        resolve(id);
                    }
                });
            });
        })
    }
    
    this.get = function(id){
        return new Promise((resolve, reject) => {
            connection.acquire(function(err, con){
                con.query('SELECT session_id, utente, user_agent, ultimo_accesso, indirizzo_ip FROM session WHERE session_id = ?', [id], function(err, result){
                    con.release();
                    if(err){
                        reject(err);
                    }else{
                        resolve(result[0]);
                    }
                });
            });
        });
    }
    
    this.updateTime=function(id){
       return new Promise((resolve, reject) => {
            connection.acquire(function(err, con){
                con.query('UPDATE sessione SET ultimo_accesso=? WHERE session_id=?', [(new Date.getTime()),id], function(err, result){
                    con.release();
                    if(err){
                        reject(err);
                    }else{
                        resolve(id);
                    }
                });
            });
        });
    }
    
    this.check=function(id){
        return new Promise((resolve, reject) =>{
            connection.acquire(function(err, con){
                con.query('SELECT utente FROM sessione WHERE session_id=?', [id], function(err, result){
                    con.release();
                    if(err){
                        reject(err);
                    }else if(result.length > 0){
                        if(result[0].utente==undefined||result[0].utente==null||result[0].utente==''){
                            reject('ERROR_SESSION_NOT_FOUND');
                        }else{
                            resolve(result[0].utente);      
                        }
                    }else{
                        reject('ERROR_SESSION_NOT_FOUND');
                    }
                });                
            });                       
        });        
    }
    
   /* this.getUser=function(id){
        return new Promise((resolve,reject) =>{
            connection.acquire(function(err, con){
                con.query('SELECT utente FROM sessione WHERE session_id=?', [id], function(err, result){
                    con.release();
                    if(err) reject(err);
                    else  if(result[0].utente==undefined||result[0].utente==null||result[0].utente==''){
                        reject('ERROR: no session matching this token');
                    } else resolve(result[0].utente);      
                });
            });
        });
    }*/
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
}

module.exports=new Session();