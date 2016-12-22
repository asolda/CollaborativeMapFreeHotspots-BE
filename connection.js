// Require mysql library for database connection
var mysql = require('mysql');
var db_suffix = ['main', 'test1', 'test2', 'test3'];
var actual_db = 0; // db_suffix index used for estabilish current DB

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
      database: 'gopher_'+db_suffix[actual_db]
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