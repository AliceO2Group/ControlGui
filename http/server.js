const config = require('./../config.json');
const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const mustache = require('mustache');
const EventEmitter = require('events').EventEmitter;
const log = require('./../log.js');
const JwtToken = require('./../jwt/token.js');
const OAuth = require('./oauth.js');

const webpush = require('web-push');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const Database = require('./db.js');

const db = new Database();

app.use(express.static(path.join(__dirname, '')));

const vapidKeys = {
  publicKey: config.pushNotifications.publicKey,
  privateKey: config.pushNotifications.privateKey
};

webpush.setVapidDetails(
  'mailto: anirudh.goel@cern.ch',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

const isValidSaveRequest = (req, res) => {
  // Check the request body has at least an endpoint.
  if (!req.body || !req.body.endpoint) {
    // Not a valid subscription.
    res.status(400);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
      error: {
        id: 'no-endpoint',
        message: 'Subscription must have an endpoint.'
      }
    }));
    return false;
  }
  return true;
};

/**
 * HTTPS server that handles OAuth and provides REST API.
 * Each request is authenticated with JWT token.
 * @author Adam Wegrzynek <adam.wegrzynek@cern.ch>
 */
class HttpServer {
  /**
   * Sets up the server, routes and binds HTTP and HTTPS sockets.
   * @param {object} credentials - private and public key file paths
   * @param {object} app
   */
  constructor(credentials, app) {
    this.app = app;

    this.jwt = new JwtToken(config.jwt);
    this.oauth = new OAuth();

    this.enableHttpRedirect();
    this.specifyRoutes();

    // HTTP server, just to redirect to HTTPS
    http.createServer(app).listen(config.http.port);

    // HTTPS server
    this.httpsServer = https.createServer(credentials, app);
    this.httpsServer.listen(config.http.portSecure);
  }

  /**
   * Specified routes and their callbacks.
   */
  specifyRoutes() {
    this.app.use(bodyParser.json());

    this.app.get('/', (req, res) => this.oAuthAuthorize(res));
    this.app.use(express.static('public'));
    this.app.use('/jquery', express.static(path.join(__dirname, '../node_modules/jquery/dist')));
    this.app.use('/jquery-ui', express.static(
      path.join(__dirname, '../node_modules/jquery-ui-dist/')
    ));
    this.app.get('/callback', (emitter, code) => this.oAuthCallback(emitter, code));
    // eslint-disable-next-line
    this.router = express.Router();
    this.router.use((req, res, next) => this.jwtVerify(req, res, next));
    this.app.use('/api', this.router);
    this.router.use('/runs', this.runs);
    this.router.post('/save-subscription', this.saveSubscription);
    this.router.post('/update-preferences', this.updatePref);
    this.router.post('/get-preferences', this.getPref);
    this.router.post('/delete-subscription', this.deleteSubscription);
  }

  /**
   * Redirects HTTP to HTTPS.
   */
  enableHttpRedirect() {
    this.app.use(function(req, res, next) {
      if (!req.secure) {
        return res.redirect('https://' + req.headers.host + req.url);
      }
      next();
    });
  }

  /**
   * OAuth redirection.
   * @param {object} res - HTTP response
   */
  oAuthAuthorize(res) {
    res.redirect(this.oauth.authorizationUri);
  }

  /**
   * OAuth callback if authentication succeeds.
   * @param {object} req - HTTP request
   * @param {object} res - HTTP response
   */
  oAuthCallback(req, res) {
    const emitter = new EventEmitter();
    this.oauth.oAuthCallback(emitter, req.query.code);
    emitter.on('userdata', function(data) {
      /* !!! JUST FOR DEVELOPMENT !!! */
      data.personid += Math.floor(Math.random() * 100);
      data.token = this.jwt.generateToken(data.personid, data.username, 1);
      data.websockethostname = config.websocket.hostname;
      data.applicationServerPublicKey = vapidKeys.publicKey;
      return res.status(200).send(this.renderPage('public/index.tpl', data));
    }.bind(this));
  }

  /**
   * Renders template using Mustache engine.
   * @param {string} page - template file path
   * @param {object} data - data to fill the template with
   * @return {string} - HTML page
   */
  renderPage(page, data) {
    const template = fs.readFileSync(page).toString();
    return mustache.to_html(template, data);
  }

  /**
   * HTTPs server getter.
   * @return {object} - HTTPs server
   */
  get server() {
    return this.httpsServer;
  }

  /**
   * Verifies JWT token synchronously.
   * @todo use promises or generators to call it asynchronously!
   * @param {object} req - HTTP request
   * @param {object} res - HTTP response
   * @param {function} next - passes control to next matching route
   */
  jwtVerify(req, res, next) {
    try {
      // console.log(req.query);
      const jwtFeedback = this.jwt.verify(req.query.token);
      req.decoded = jwtFeedback.decoded;
      next();
    } catch (err) {
      log.debug(this.constructor.name, ':', err.name);
      res.status(403).json({message: err.name});
    }
  }

  /**
   * For the test purposes.
   * Simply returns JSON encoded fixed run number.
   * @param {object} req - HTTP request
   * @param {object} res - HTTP response
   */
  runs(req, res) {
    res.json({run: 123});
  }

  /**
   * Receives User Subscription object from 'web-push' server
   * and saves it to Database
   * @param {object} req - request object
   * @param {object} res - response object
   */
  saveSubscription(req, res) {
    if (!isValidSaveRequest(req, res)) {
      res.send();
      return;
    }

    db.insertSubscription(req.body)
      .then(function() {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({data: {success: true}}));
      })
      .catch(function(err) {
        res.status(500);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
          error: {
            id: 'unable-to-save-subscription',
            message: 'The subscription was received but we were unable to save it to our database.'
          }
        }));
      });
  }

  /**
   * Receives User Notification Preferences and updates it in Database
   * @param {object} req - request object
   * @param {object} res - response object
   */
  updatePref(req, res) {
    db.updatePreferences(req.body)
      .then(function() {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({data: {success: true}}));
      })
      .catch(function(err) {
        res.send(err);
      });
  }

  /**
   * Gets User Notification Preferences from Database
   * and passes it to browser
   * @param {object} req - request object
   * @param {object} res - response object
   */
  getPref(req, res) {
    db.getPreferences(req.body)
      .then(function(preferences) {
        res.setHeader('Content-Type', 'application/json');
        res.send(preferences);
      })
      .catch(function(err) {
        res.send(err);
      });
  }

  /**
   * Deletes user subscription from database
   * @param {object} req - request object
   * @param {object} res - response object
   */
  deleteSubscription(req, res) {
    db.deleteSubscription(req.body.endpoint)
      .then(function() {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({data: {success: true}}));
      })
      .catch(function(err) {
        res.send(err);
      });
  }
}
module.exports = HttpServer;
