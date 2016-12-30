var connection = require('../connection');
var crypto = require('crypto');
var Promise = require('promise');
var uuid=require('node-uuid');

function Session(){
    
    this.create=function(userId, ipaddress){        
        var token=crypto.createHash('sha256').update(uuid.v1()).update(crypto.randomBytes(256)).digest("hex");//crea il token senza possibilità di collisioni     
        return new Promise((resolve,reject)=>{
            connection.acquire(function(err,con){
                con.query('INSERT INTO sessione (session_id, user_agent, utente, utimo_accesso, indirizzo_ip) values(?,?,?,?,?)', [token, 'test', userId, (new Date().getTime()), ipaddress],function(err, result){
                    con.release();
                    resolve(token);
                    catch(err){
                        reject(err);
                    }
                });
            });
        })
    };
    
   
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
    };
    
    this.updateTime=function(id){
        //
    };
    
}

module.export=new Session();