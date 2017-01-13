var connection = require('../connection');
var crypto = require('crypto');
var Promise = require('promise');
var config = require('../config');
var mailer = require('../mailer');

var token = require('./token');

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function validatePassword(password) {
    var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
    return re.test(password);
}



function User() {
    this.get = function (user_id) {
        return new Promise((resolve, reject) => {
            connection.acquire(function (err, con) {
                con.query('SELECT * FROM utente WHERE id=?', [user_id], function (err, result) {
                    if (err) {
                        reject('ERROR_DB');
                    } else {
                        if (result.length > 0) resolve(result[0]);
                        else reject('ERROR_NOT_FOUND');
                    }
                    con.release();
                }
                );
            });
        });
    }

    this.getid = function (email) {
        return new Promise((resolve, reject) => {
            connection.acquire(function (err, con) {
                con.query('SELECT id FROM utente WHERE email=?', [email], function (err, result) {
                    if (err) {
                        reject(err);
                    } else if (result.length > 0) {
                        if (result[0].id == undefined || result[0].id == null || result[0].id == '') {
                            reject('ERROR_USER_NOT_FOUND');
                        } else {
                            resolve(result[0].id);
                        }
                    } else {
                        reject('ERROR_USER_NOT_FOUND');
                    }
                });
            });
        });
    }

    this.create_user_request = function (user, res) {
        connection.acquire(function (err, con) {
            if ((user.email == null || user.email.length == 0) && (user.password == null || user.password.length == 0)) {
                res.send({ status: 1, message: 'ERROR_EMAIL_PASSWORD' });
            } else if (user.email == null || user.email.length == 0 || !validateEmail(user.email)) {
                res.send({ status: 1, message: 'ERROR_EMAIL' });
            } else if (user.password == null || user.password.length == 0 || !validatePassword(user.password)) {
                res.send({ status: 1, message: 'ERROR_PASSWORD' });
            } else if (user.password.length < 8) {
                res.send({ status: 1, message: 'ERROR_PASSWORD_LENGTH' });
            } else {
                con.query('SELECT COUNT(id) AS n_found FROM utente WHERE email=?', [user.email], function (err, result) {
                    if (err) {
                        res.send({ status: 1, message: 'ERROR_DB' });
                    } else {
                        if (result.length == 0 || result[0].n_found == 0) {
                            // Generate token
                            token.generate(user.email).then(token_generated => {
                                if (token_generated != null) {
                                    // Encode frontend URL to be parsed from express into GET requests
                                    var url = encodeURIComponent(user.frontend_url);

                                    // Send mail
                                    mailer.transporter.sendMail({
                                        from: config.smtp_google_user,
                                        to: user.email,
                                        subject: user.email + ', conferma la registrazione del tuo account su AlwaysConnected',
                                        text: 'Per confermare la registrazione, clicca qui: ' + config.server_ip_address_http + ':' + config.server_port + '/user/new/do/token/' + token_generated + '/email/' + user.email + '/password/' + user.password + '/redirect/' + url
                                    }, function (err, responseStatus) {
                                        mailer.transporter.close();
                                    });

                                    // Send JSON to middleware informing mail is sent
                                    res.send({ status: 0, message: 'REGISTRATION_REQUEST_OK' });
                                } else {
                                    res.send({ status: 1, message: 'ERROR_DB' });
                                }
                            }).catch(err => {
                                res.send({ status: 1, message: 'ERROR_DB', extra: err.message });
                            });
                        } else {
                            res.send({ status: 1, message: 'ERROR_EMAIL_ALREADY_EXISTS' });
                        }
                    }
                });
            }
            con.release();
        });
    };

    this.create_do_request = function (user, res) {
        this.create(user).then(message_ok => {
            var url_parsed = decodeURIComponent(user.redirect_url);
            res.redirect(url_parsed);
        }).catch(message_error => {
            res.send({ status: 1, message: message_error });
        });
    }

    this.create = function (user) {
        return new Promise((resolve, reject) => {
            connection.acquire(function (err, con) {
                if ((user.email == null || user.email.length == 0) && (user.password == null || user.password.length == 0)) {
                    con.release();
                    reject('ERROR_EMAIL_PASSWORD');
                } else if (user.email == null || user.email.length == 0 || !validateEmail(user.email)) {
                    con.release();
                    reject('ERROR_EMAIL');
                } else if (user.password == null || user.password.length == 0 || !validatePassword(user.password)) {
                    con.release();
                    reject('ERROR_PASSWORD');
                } else if (user.password.length < 8) {
                    con.release();
                    reject('ERROR_PASSWORD_LENGTH');
                } else {
                    var hash_psw = crypto.createHash('sha1').update(user.password).digest("hex");
                    con.query('INSERT INTO utente (email, password) VALUES (?, ?)', [user.email, hash_psw], function (err, result) {
                        con.release();
                        if (err) {
                            reject('ERROR_DB');
                        } else {
                            resolve('INSERT_OK');
                        }
                    });
                }
            });
        });
    }

    this.reset_password_request = function (user, res) {
        connection.acquire(function (err, con) {
            if (user.email == null || user.email.length == 0 || !validateEmail(user.email)) {
                res.send({ status: 1, message: 'ERROR_EMAIL' });
            } else {
                con.query('SELECT COUNT(id) AS n_found FROM utente WHERE email=?', [user.email], function (err, result) {
                    if (err) {
                        res.send({ status: 1, message: 'ERROR_DB' });
                    } else {
                        if (result[0].n_found > 0) {
                            // Generate token
                            token.generate(user.email).then(token_generated => {
                                if (token_generated != null) {
                                    // Encode frontend URL to be parsed from express into GET requests
                                    var url = encodeURIComponent(user.frontend_url);

                                    // Send mail
                                    mailer.transporter.sendMail({
                                        from: config.smtp_google_user,
                                        to: user.email,
                                        subject: user.email + ', conferma il recupero psw. account su AlwaysConnected',
                                        text: 'Per confermare il recupero, clicca qui: ' + config.server_ip_address_http + ':' + config.server_port + '/user/reset_password/token/' + token_generated + '/redirect/' + url
                                    }, function (err, responseStatus) {
                                        mailer.transporter.close();
                                    });

                                    // Send JSON to middleware informing mail is sent
                                    res.send({ status: 0, message: 'RESET_REQUEST_OK' });
                                } else {
                                    res.send({ status: 1, message: 'ERROR_DB' });
                                }
                            }).catch(err => {
                                res.send({ status: 1, message: 'ERROR_DB' });
                            });
                        } else {
                            res.send({ status: 1, message: 'ERROR_EMAIL_NOT_FOUND' });
                        }
                    }
                });
            }
            con.release();
        });
    };

    this.set_password_do_request = function (email, password, res) {
        this.set_password(email, password).then(message_ok => {
            res.send({ status: 0, message: message_ok });
        }).catch(message_error => {
            res.send({ status: 1, message: message_error });
        });
    }

    this.set_password = function (email, password) {
        return new Promise((resolve, reject) => {
            if (password == null || password.length == 0 || !validatePassword(password)) {
                reject('ERROR_PASSWORD');
            } else if (password.length < 8) {
                reject('ERROR_PASSWORD_LENGTH');
            } else {
                connection.acquire(function (err, con) {
                    var hash_psw = crypto.createHash('sha1').update(password).digest("hex");
                    con.query('UPDATE utente SET password=? WHERE email=?', [hash_psw, email], function (err, result) {
                        if (err) {
                            reject('ERROR_DB');
                        } else {
                            resolve('PASSWORD_UPDATED');
                        }
                    });
                });
            }
        });
    }

    this.authorize = function (user) {
        return new Promise((resolve, reject) => {
            connection.acquire(function (err, con) {
                if ((user.email == null || user.email.length == 0) && (user.password == null || user.password.length == 0)) {
                    reject('ERROR_EMAIL_PASSWORD');
                } else if (user.email == null || user.email.length == 0 || !validateEmail(user.email)) {
                    reject('ERROR_EMAIL');
                } else if (user.password == null || user.password.length == 0) {
                    reject('ERROR_PASSWORD');
                } else {
                    var mail = user.email, hash_psw = crypto.createHash('sha1').update(user.password).digest("hex");

                    con.query('SELECT password, id FROM utente WHERE email=?', [mail], function (err2, result) {
                        if (err2) {
                            reject(err2.message);
                        } else {
                            if (result.length > 0) {
                                if (result[0].password == null || result[0].password == "" || result[0] == undefined) {
                                    reject(err2.message);
                                } else if (result[0].password == hash_psw) {
                                    resolve(result[0].id);
                                } else reject('ERROR_CREDENTIALS');
                            } else {
                                reject('ERROR_CREDENTIALS');
                            }
                        }
                    });
                    con.release();
                }
            });
        });
    };

    this.delete_request = function (user_id, data, res) {
        this.get(user_id).then(user => {
            token.generate(user.email).then(token_generated => {
                // Encode frontend URL to be parsed from express into GET requests
                var url = encodeURIComponent(data.frontend_url);

                // Send mail
                mailer.transporter.sendMail({
                    from: config.smtp_google_user,
                    to: user.email,
                    subject: user.email + ', conferma l\'eliminazione del tuo account su AlwaysConnected',
                    text: 'Per confermare l\'eliminazione del tuo account, clicca qui: ' + config.server_ip_address_http + ':' + config.server_port + '/user/delete/token/' + token_generated + '/redirect/' + url
                }, function (err, responseStatus) {
                    mailer.transporter.close();
                });

                res.send({ status: 0, message: 'DELETE_REQUEST_OK' });
            }).catch(message_error => {
                res.send({ status: 1, message: message_error });
            });
        }).catch(message_error => {
            res.send({ status: 1, message: message_error });
        });
    };

    this.delete_do_request = function (user_id, res) {
        this.delete(user_id).then(message_ok => {
            res.send({ status: 0, message: message_ok });
        }).catch(message_error => {
            res.send({ status: 1, message: message_error });
        });
    }


    this.delete = function (user_id) {
        return new Promise((resolve, reject) => {
            connection.acquire(function (err, con) {
                con.query('DELETE FROM utente WHERE id = ?', [user_id], function (err, result) {
                    if (err) {
                    reject('ERROR_DB');
                    } else resolve(user_id);
                });
           });
        });
    }



    /*genid=function(req){
    return crypto.createHash('sha256').update(uuid.v1()).update(crypto.randomBytes(256)).digest("hex");}*/

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