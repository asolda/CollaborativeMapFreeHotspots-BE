var connection = require('../connection');
var crypto = require('crypto');

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function validatePassword(password){
    var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
    return re.test(password);
}



function User() {
    this.create = function(user, res){
        connection.acquire(function(err, con) {
            if((user.email == null || user.email.length==0) && (user.password == null || user.password.length==0)){
                res.send({status: 0, message: 'ERROR_EMAIL_PASSWORD'});
            }else if(user.email == null || user.email.length==0 || !validateEmail(user.email)){
                res.send({status: 0, message: 'ERROR_EMAIL'});
            }else if(user.password == null || user.password.length==0 || !validatePassword(user.password)){
                res.send({status: 0, message: 'ERROR_PASSWORD'});
            }else if(user.password.length<8){
                res.send({status: 0, message: 'ERROR_PASSWORD_LENGTH'});
            }else{
                var hash_psw = crypto.createHash('sha1').update(user.password).digest("hex");
                con.query('INSERT INTO utente (email, password) VALUES (?, ?)', [user.email, hash_psw], function(err, result) {
                    con.release();
                    if(err){
                        res.send({status: 1, message: 'ERROR_DB'});
                    }else{
                        res.send({status: 0, message: 'INSERT_OK'});
                    }
                });
            }
        });
    }

    /*
  this.get = function(res) {
    connection.acquire(function(err, con) {
      con.query('select * from users', function(err, result) {
        con.release();
        res.send(JSON.stringify(result));
      });
    });
  };

  this.create = function(user, res) {
    connection.acquire(function(err, con) {
      con.query('insert into users set ?', user, function(err, result) {
        con.release();
        if (err) {
          res.send({status: 1, message: 'USER creation failed', query: 'insert into users set ' + user});
        } else {
          res.send({status: 0, message: 'USER created successfully'});
        }
      });
    });
  };

  this.update = function(user, res) {
    connection.acquire(function(err, con) {
      con.query('update users set ? where email = ?', [user, user.email], function(err, result) {
        con.release();
        if (err) {
          res.send({status: 1, message: 'USER update failed'});
        } else {
          res.send({status: 0, message: 'USER updated successfully'});
        }
      });
    });
  };

  this.delete = function(email, res) {
    connection.acquire(function(err, con) {
      con.query('delete from users where email = ?', [email], function(err, result) {
        con.release();
        if (err) {
          res.send({status: 1, message: 'Failed to delete'});
        } else {
          res.send({status: 0, message: 'Deleted successfully'});
        }
      });
    });
  };

  this.search = function(email, res) {
    connection.acquire(function(err, con) {
      con.query('select * from users where email = ?', [email], function(err, result) {
        con.release();
        if(err) {
          res.send({status:1, message: 'Failed to search'});
        } else {
          if(result.length == 0) {
            res.send({status: 0, message: 'User not found'});
        } else {
          res.send(result);
          }
        }
      });
    });
  }*/
}
module.exports = new User();