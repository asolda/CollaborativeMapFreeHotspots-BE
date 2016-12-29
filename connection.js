// Require mysql library for database connection
var mysql = require('mysql');

// Connection function for DB interaction
function Connection() {
  this.pool = null;
 
  // Config
  this.init = function() {
    this.pool = mysql.createPool({
      connectionLimit: 10,
      host: '127.0.0.1',
	  port: '3306',
      user: 'root',
      password: 'admin',
      database: 'gopher_main'
    });
  };
  
  this.switch_db = function(new_db) {
    if(this.pool!= null){
    this.pool = this.pool.end();
    }
    this.pool = mysql.createPool({
      connectionLimit: 10,
      host: '127.0.0.1',
	  port: '3306',
      user: 'root',
      password: 'admin',
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