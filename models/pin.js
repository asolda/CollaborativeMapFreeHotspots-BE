var connection = require('../connection');


function Pin(){
	// Another test to delete in future; retrieves back the payload parameters to check if requests and responses are sent correctly
	this.testpoint = function(req, res){
		connection.acquire(function(err, con){
		res.send({status: 0, message: 'All OK', latitude: req.body.latitude, longitude: req.body.longitude});
    });
  };
  
	this.getlistpin = function(req, res){
		connection.acquire(function(err, con){
            var md = req.params;
			con.query('SELECT id,latitudine,longitudine,range_wifi,numero_segnalazioni FROM rete_wifi WHERE latitudine >= ?-? && '+
						'latitudine <= ?+? && longitudine >= ?-? && longitudine <= ?+?',
                            [md.latitudine, md.radius_lat, md.latitudine, md.radius_lat, md.longitudine, md.radius_long, md.longitudine, md.radius_long],
				function(err, result) {
                    if(err){
                        res.send({status: 1, message: 'ERROR_DB'})
                    }else{
                        res.setHeader('Content-Type', 'application/json');
                        res.send(JSON.stringify(result));
                    }
					con.release();
				}
			);
		});
		//res.send({status: 0, message: 'All OK', latitude: req.body.latitude, longitude: req.body.longitude});
    };
    
    this.get = function(rete_wifi){
        return new Promise((resolve, reject) => {
            connection.acquire(function(err, con){
                con.query('SELECT ssid, qualità, necessità_login, restrizioni, altre_informazioni, range_wifi, utente FROM rete_wifi WHERE id=?', [rete_wifi], function(err, result) {
                        if(err){
                            reject('ERROR_DB');
                        }else{
                            resolve(result);
                        }
                        con.release();
                    }
                );
            });
        });
    }
    
    this.insert = function(data, res){
        if(data.ssid == null || data.ssid.length==0){
            res.send({status: 1, message: 'ERROR_SSID'});
        }else if(data.qualità <= 0 || data.qualità > 5){
            res.send({status: 1, message: 'ERROR_QUALITY'});
        }else if(isNaN(data.necessità_login) || data.necessità_login < 0 || data.necessità_login > 1){
            res.send({status: 1, message: 'ERROR_LOGIN_NECESSARY'});
        }else if(isNaN(data.range) || data.range <= 0){
            res.send({status: 1, message: 'ERROR_RANGE'});
        }else if(isNaN(data.latitudine)){
            res.send({status: 1, message: 'ERROR_LATITUDE'});
        }else if(isNaN(data.longitudine)){
            res.send({status: 1, message: 'ERROR_LONGITUDE'});
        }else{
            connection.acquire(function(err, con){
                con.query('INSERT INTO rete_wifi (ssid, qualità, latitudine, longitudine, necessità_login, restrizioni, altre_informazioni, range_wifi, utente) '+
                            'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [data.ssid, data.qualità, data.latitudine, data.longitudine, data.necessità_login, data.restrizioni,
                                                                    data.altre_informazioni, data.range, data.utente],
                    function(err, result) {
                        if(err){
                            res.send({status: 1, message: 'ERROR_DB'})
                        }else{
                            res.send({status: 0, message: 'INSERT_OK'});
                        }
                        con.release();
                    }
                );
            });
        }
    }
    
    this.edit = function(data, res){
        if(isNaN(data.range) || data.range <= 0){
            res.send({status: 1, message: 'ERROR_RANGE'});
        }else{
            connection.acquire(function(err, con){
                var i=0;
                var array_params=[];
                var query_str="";
                if(!(data.restrizioni == null || data.restrizioni == '')){
                    query_str+=", restrizioni=?";
                    array_params[i]=data.restrizioni;
                    i++;
                }
                query_str+=", range_wifi=?";
                array_params[i]=data.range;
                i++;
                if(!(data.altre_informazioni == null || data.altre_informazioni == '')){
                    query_str+=", altre_informazioni=?";
                    array_params[i]=data.altre_informazioni;
                    i++;
                }
                query_str=query_str.substring(2);
                
                console.log("query="+query_str);
                con.query('UPDATE rete_wifi SET '+query_str+' WHERE id = ?', array_params.concat(data.rete_wifi),
                    function(err, result) {
                        if(err){
                            res.send({status: 1, message: 'ERROR_DB', extra: err.message})
                        }else{
                            res.send({status: 0, message: 'EDIT_OK'});
                        }
                        con.release();
                    }
                );
            });
        }
    }
    
    this.rank = function(data, res){
        if(isNaN(data.voto) || data.voto <= 0 || data.voto > 5){
            res.send({status: 1, message: 'ERROR_RANKING'});
        }else{
            console.log(JSON.stringify(data));
            connection.acquire(function(err, con){
                con.query('SELECT utente FROM rete_wifi WHERE id = ?', [data.rete_wifi], function(err, result) {
                    if(err){
                        res.send({status: 1, message: 'ERROR_DB'});
                    }else if(result.length > 0){
                        if(result[0].utente != data.utente){
                            con.query('INSERT INTO valuta (utente, rete_wifi, voto) VALUES (?, ?, ?)', [data.utente, data.rete_wifi, data.voto], function(err, result) {
                                    if(err){
                                        res.send({status: 1, message: 'ERROR_DB'});
                                    }else{
                                        /* Details about this query:
                                        
                                            The owner of the network gives his own ranking to the network (qualità=x, numero_recensioni=0);
                                            when user ranks the network, qualità is calculated like that because numero_recensioni+1(owner rank)+1(new rank).
                                        */
                                        con.query('UPDATE rete_wifi SET qualità = (((qualità*(numero_recensioni+1)) + ?) / (numero_recensioni+2)), numero_recensioni = numero_recensioni+1 '+
                                        'WHERE id = ?', [data.voto, data.rete_wifi], function(err, result) {
                                            if(err){
                                                res.send({status: 1, message: 'ERROR_DB'});
                                            }else{
                                                res.send({status: 0, message: 'RANKING_OK'});
                                            }
                                        });
                                    }
                                    con.release();
                                }
                            );
                        }else{
                            res.send({status: 1, message: 'ERROR_IS_OWNER'});
                        }
                    }else{
                        res.send({status: 1, message: 'ERROR_DB4'})
                    }
                });
            });
        }
    }
    
    this.delete = function(data, res){
        connection.acquire(function(err, con){
                con.query('SELECT utente FROM rete_wifi WHERE id = ?', [data.rete_wifi], function(err, result) {
                    if(err){
                        res.send({status: 1, message: 'ERROR_DB'});
                    }else if(result.length > 0){
                        if(result[0].utente == data.utente){
                            con.query('DELETE FROM segnalazione WHERE rete_wifi = ?', [data.rete_wifi], function(err, result) {
                                if(err){
                                    res.send({status: 1, message: 'ERROR_DB'});
                                }
                            });
                            con.query('DELETE FROM valuta WHERE rete_wifi = ?', [data.rete_wifi], function(err, result) {
                                if(err){
                                    res.send({status: 1, message: 'ERROR_DB'});
                                }
                            });
                            con.query('DELETE FROM rete_wifi WHERE id = ?', [data.rete_wifi], function(err, result) {
                                if(err){
                                    res.send({status: 1, message: 'ERROR_DB'});
                                }
                            });
                            res.send({status: 0, message: 'DELETE_OK'});
                        }else{
                            res.send({status: 1, message: 'ERROR_IS_NOT_OWNER'});
                        }
                    }else{
                        res.send({status: 1, message: 'ERROR_DB'})
                    }
                });
        });
    }
}
module.exports = new Pin();
