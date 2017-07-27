const mysql = require('mysql');
const config = require('./../config.json');
const log = require('./../log.js');

const con = mysql.createConnection({
  host: config.pushNotifications.host,
  user: config.pushNotifications.user,
  password: config.pushNotifications.password,
  database: config.pushNotifications.database
});

con.connect(function(err) {
  if (err) {
    throw err;
  }
  log.debug('Connected');
});


module.exports = {
  // Module for saving subscriotion to MySQL database
  insertSubscription: function(sub) {
    let endpoint = sub.endpoint;
    let authKey = sub.keys.auth;
    let p256dhKey = sub.keys.p256dh;

    let sql = 'INSERT INTO subscriptions (endpoint, auth_key, p256dh_key) VALUES (?, ?, ?)';

    return new Promise(function(resolve, reject) {
      con.query(sql, [endpoint, authKey, p256dhKey], function(err, result) {
        if (err) {
          throw reject(err);
        }
        log.debug('Subscription saved successfully in database.');
        resolve(true);
      });
    });
  },

  // Module for deleting subscriotion from MySQL database
  deleteSubscription: function(endpoint) {
    let sql = 'DELETE FROM subscriptions WHERE endpoint = ?';

    return new Promise(function(resolve, reject) {
      con.query(sql, [endpoint], function(err, result) {
        if (err) {
          throw reject(err);
        }
        log.debug('Deleted successfully from database. endpoint: ', endpoint);
        resolve(true);
      });
    });
  },

  // Module for updating user notification preferences in MySQL database
  updatePreferences: function(data) {
    let endpoint = data.endpoint;
    let preferences = data.preferences;

    let sql = 'UPDATE subscriptions SET preferences = ? WHERE endpoint = ?';

    return new Promise(function(resolve, reject) {
      con.query(sql, [preferences, endpoint], function(err, result) {
        if (err) {
          throw reject(err);
        }
        log.debug('Preferences Updated successfully.');
        resolve(true);
      });
    });
  },

  // Module for fetching user notification preferences from MySQL database
  getPreferences: function(data) {
    let endpoint = data.endpoint;

    let sql = 'SELECT preferences FROM subscriptions WHERE endpoint = ?';

    return new Promise(function(resolve, reject) {
      con.query(sql, [endpoint], function(err, result) {
        if (err) {
          throw reject(err);
        }
        resolve(result);
      });
    });
  }
};
