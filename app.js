// Requires npm packages
var express = require('express');
var bodyparser = require('body-parser');
var cookieparser = require('cookie-parser');

var config = require('./config');
var mailer = require('./mailer');
mailer.init();


// Require also internal backend node scripts
var connection = require('./connection'); // Note: exported 'class' Connection()
var routes = require('./routes'); // Note: exported 'configure' function
 
// Init express
var app = express();
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
app.use(cookieparser());

// Server cross-domain details for setting possible accesses
var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*'); // Allow cross-domain control access only to the server itself
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE'); // Allow those operations
  res.header('Access-Control-Allow-Headers', 'Content-Type');		 // Headers allowed
  next();
}
 
// Use cross domain config function inside the app
app.use(allowCrossDomain);

connection.init(); // Init DB
routes.configure(app); // Give express to configure option for end-points configuration

// Start the server
var server = app.listen(config.server_port, config.server_ip_address, function() {
  console.log('Server active, listening on port ' + server.address().port + '.');
});
