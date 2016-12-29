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
            //con.query('SELECT id,latitudine,longitudine,numero_segnalazioni FROM rete_wifi WHERE latitudine >= '+req.params.latitudine+'-100 && '+
			//			'latitudine <= '+req.params.latitudine+'+100 && longitudine >= '+req.params.longitudine+'-100 && longitudine <= '+req.params.longitudine+'+100',
            var md = req.params;
			con.query('SELECT id,latitudine,longitudine,numero_segnalazioni FROM rete_wifi WHERE latitudine >= ?-? && '+
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
}
module.exports = new Pin();
