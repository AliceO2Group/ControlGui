const webpush = require('web-push');
const argv = require('yargs').argv;
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
});

/*
For using 'web-push' package you need to generate a VAPID Public and Private Key Pair.
You can generate the VAPID keys by 2 methods
1. By installing 'web-push' globally and generating keys from terminal using these commands-

npm install -g web-push
web-push generate-vapid-keys

2. By going to Google CodeLab - https://web-push-codelab.appspot.com/
(Use Chrome or Mozilla, not Safari)
*/
const vapidKeys = {
  publicKey: config.pushNotifications.publicKey,
  privateKey: config.pushNotifications.privateKey
};

webpush.setVapidDetails(
  'mailto: alice-o2-flp-prototype@cern.ch',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

/**
 * Fetches subscriptions from db then verifies them and sends notifications.
 * @return {promise}
 */
function sendNotif() {
  const type = argv.type;
  const dataToSend = argv.message;

  return getSubscriptions()
    .then(function(subscriptions) {
      let promiseChain = Promise.resolve();

      for (let i = 0; i < subscriptions.length; i++) {
        let subscription = subscriptions[i];
        subscription = formatSubscription(subscription);

        let pref = subscription.preferences.split('');

        if (pref[type - 1] == 1) {
          promiseChain = promiseChain.then(() => {
            return triggerPushMsg(subscription, dataToSend);
          });
        }
      }
    })
    .catch(function(err) {
      throw new Error(err);
    });
}
sendNotif();

/**
 * Sends push notifications to subscribed users
 * @param {object} subscription - Subscription object with user endpoint
 * @param {string} dataToSend - String message to be sent in notification
 * @return {promise} webpush.sendNotification - Sends Notification
 */
function triggerPushMsg(subscription, dataToSend) {
  return webpush.sendNotification(subscription, dataToSend)
    .catch((err) => {
      if (err.statusCode === 410) {
        return deleteSubscriptionFromDatabase(subscription.endpoint);
      } else {
        log.warn('Subscription is no longer valid: ', err);
      }
    });
}

/**
 * Deletes user subscriptions from Database
 * @param {string} endpoint - URL to identify each user
 * @return {promise}
 */
function deleteSubscriptionFromDatabase(endpoint) {
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
}

/**
 * Fetches subscriptions from Database
 * @return {promise}
 */
function getSubscriptions() {
  let sql = 'SELECT * FROM subscriptions';

  return new Promise(function(resolve, reject) {
    con.query(sql, function(err, result) {
      if (err) {
        throw reject(err);
      }
      resolve(result);
    });
  });
}

/**
 * Formats the subscription to a suitable format to be sent to 'web-push' server
 * @param {object} sub - Subscription object fetched from Database
 * @return {object} formattedSubscription - Subscription object reformatted
 */
function formatSubscription(sub) {
  let formattedSubscription = {
    'id': sub.sub_id,
    'endpoint': sub.endpoint,
    'keys': {
      'p256dh': sub.p256dh_key,
      'auth': sub.auth_key
    },
    'preferences': sub.preferences
  };
  return formattedSubscription;
}
