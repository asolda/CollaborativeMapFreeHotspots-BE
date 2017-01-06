// Require mysql library for database connection
var mysql = require('mysql');
var config = require('./config');

// Connection function for DB interaction
function Connection() {
  this.pool = null;
 
  // Config
  this.init = function() {
    this.pool = mysql.createPool({
      connectionLimit: 10,
      host: config.mysql_host,
	  port: config.mysql_port,
      user: config.mysql_user,
      password: config.mysql_pass,
      database: 'gopher_main'
    });
  };
  
  this.switch_db = function(new_db) {
    if(this.pool!= null){
    this.pool = this.pool.end();
    }
    this.pool = mysql.createPool({
      connectionLimit: 10,
      host: config.mysql_host,
	  port: config.mysql_port,
      user: config.mysql_user,
      password: config.mysql_pass,
      database: 'gopher_'+new_db
    });
  };
 
  this.acquire = function(callback) {
    this.pool.getConnection(function(err, connection) {
      callback(err, connection);
    });
  };
}

// Export this function to other node scripts
module.exports = new Connection();