// Models, MUST EDIT.
var user = require('./models/user');
var pin = require('./models/pin');
var segnala = require('./models/segnala');

//commento per demo git
 
module.exports = {
  configure: function(app) {
	  
	// localhost test at endpoint / for watch if node is working properly
    app.get('/', function(req, res) {
		res.end('If you reach this endpoint, then Node.js is working! :D');
	});

	
	
	
	// Endpoints. MUST EDIT, WORK IN PROGRESS.
    app.get('/user/', function(req, res) {
      user.get(res);
    });
 
    app.post('/user/', function(req, res) {
      user.create(req.body, res);
    });
 
    app.put('/user/', function(req, res) {
      user.update(req.body, res);
    });
	
	app.post('/pin/testcoordinates/', function(req, res) {
		pin.testpoint(req, res);
    });
	
	app.get('/pin/get_networks/:latitudine/:longitudine/:radius_lat/:radius_long', function(req, res){
		pin.getlistpin(req, res);
	});
    
    app.post('/segnala/', function(req, res){
        segnala.report(req, res);
    });
 
    app.delete('/user/:email/', function(req, res) {
      user.delete(req.params.email, res);
    });

    app.get('/user/search/:email/', function(req, res) {
      user.search(req.params.email, res);
    });
  }
};
