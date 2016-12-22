var connection = require('../connection');


function Segnala(){
	this.report = function(req, res){
		connection.acquire(function(err, con){
            /*
                INSERT INTO segnalazione (utente, rete_wifi, tipo, dettagli)
                VALUES ('+req.body.utente+', '+req.body.rete_wifi+', '+req.body.tipo+', '+req.body.dettagli+')
            */
            
            
			con.query('INSERT INTO segnalazione (utente, rete_wifi, tipo, dettagli) VALUES ('+req.body.utente+', '+req.body.rete_wifi+', '+req.body.tipo+', \''+req.body.dettagli+'\')',
				function(err, result) {
					con.release();
                    if(err!=null) res.send({status: 1, message: 'ERROR_DB'});
                    else{
                        if(result.affectedRows>0){
                            res.send({status: 0, message: 'REPORT_OK'});
                        }
                    }
                }
			);
		});
		//res.send({status: 0, message: 'All OK', latitude: req.body.latitude, longitude: req.body.longitude});
  };
}
module.exports = new Segnala();
