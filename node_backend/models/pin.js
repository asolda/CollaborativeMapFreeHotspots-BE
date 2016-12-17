var connection = require('../connection');


function Pin() {

  this.testpoint = function(req, res) {
    connection.acquire(function(err, con) {
		res.send({status: 0, message: 'All OK', latitude: req.body.latitude, longitude: req.body.longitude});
    });
  };
  
  this.getlistpin = function(req, res) {
	  connection.acquire(function(err, con) {
		con.query('SELECT * FROM pin WHERE latitude >= 50-100 && latitude <= 50+100 && longitude >= 50-100 && longitude <= 50+100',
			  function(err, result) {
				con.release();
				res.send(JSON.stringify(result));
			  });
		});
		//res.send({status: 0, message: 'All OK', latitude: req.body.latitude, longitude: req.body.longitude});
  };
}
module.exports = new Pin();
