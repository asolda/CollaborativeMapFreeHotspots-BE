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
			con.query('SELECT * FROM rete_wifi WHERE latitudine >= '+req.body.latitude+'-100 && '+
						'latitudine <= '+req.body.latitude+'+100 && longitudine >= '+req.body.longitude+'-100 && longitudine <= '+req.body.longitude+'+100',
				function(err, result) {
					con.release();
					res.send(JSON.stringify(result));
				}
			);
		});
		//res.send({status: 0, message: 'All OK', latitude: req.body.latitude, longitude: req.body.longitude});
  };
}
module.exports = new Pin();
