var connection = require('../connection');


function Segnala(){
	this.report = function(user_id, req, res){
		connection.acquire(function(err, con){
            con.query('INSERT INTO segnalazione (utente, rete_wifi, tipo, dettagli) VALUES (?, ?, ?, ?)', [user_id, req.body.rete_wifi, req.body.tipo, req.body.dettagli],
				function(err, result) {
					con.release();
                    if(err!=null) res.send({status: 1, message: 'ERROR_DB'});
                    else{
                        if(result.affectedRows>0){
                            con.query('UPDATE rete_wifi SET numero_segnalazioni = numero_segnalazioni + 1 WHERE id = ?', [req.body.rete_wifi], function(err, result){
                                if(err){
                                    res.send({status: 1, message: 'ERROR_DB'});
                                }else{
                                    res.send({status: 0, message: 'REPORT_OK'});
                                } 
                            });
                        }
                    }
                }
			);
		});
		//res.send({status: 0, message: 'All OK', latitude: req.body.latitude, longitude: req.body.longitude});
    };
    
    this.check_num_notifications = function(user_id, res){
        connection.acquire(function (err, con) {
            con.query('SELECT COUNT(*), visualizzato AS num_visual FROM segnalazione INNER JOIN rete_wifi ON segnalazione.rete_wifi=rete_wifi.id WHERE rete_wifi.utente=? HAVING segnalazione.visualizzato = 0', [user_id],
                function (err, result) {
                    if (err) {
                        res.send({ status: 1, message: 'ERROR_DB' })
                    } else {
                        if(result.length > 0){
                            res.send({status: 0, message: result.num_visual});
                        }else{
                            res.send({status: 0, message: 0});
                        }
                    }
                    con.release();
                }
            );
        });
    };
    
    this.notifications = function(user_id, res){
        connection.acquire(function (err, con) {
            con.query('SELECT * FROM segnalazione INNER JOIN rete_wifi ON segnalazione.rete_wifi=rete_wifi.id WHERE rete_wifi.utente=?', [user_id],
                function (err, result) {
                    if (err) {
                        res.send({ status: 1, message: 'ERROR_DB' })
                    } else {
                        res.setHeader('Content-Type', 'application/json');
                        res.send(JSON.stringify(result));
                    }
                    con.release();
                }
            );
        });
    };
}
module.exports = new Segnala();
