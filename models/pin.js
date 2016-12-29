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
    
    this.get = function(req, res){
        connection.acquire(function(err, con){
			con.query('SELECT ssid, qualità, necessità_login, restrizioni, altre_informazioni, range_wifi, utente FROM rete_wifi WHERE id=?', [req.params.id], function(err, result) {
                    if(err){
                        res.send({status: 1, message: 'ERROR_DB'});
                    }else{
                        res.setHeader('Content-Type', 'application/json');
                        res.send(JSON.stringify(result));
                    }
					con.release();
				}
			);
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
                            console.log(err.message);
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
}
module.exports = new Pin();
