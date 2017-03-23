const config = require('./../config.json');
const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const mustache = require('mustache');
const EventEmitter = require('events').EventEmitter;

const JwtToken = require('./../jwt/token.js');
const OAuth = require('./oauth.js');

/**
 * HTTPs server needed by REST API
 *  @author Adam Wegrzynek <adam.wegrzynek@cern.ch>
 */
module.exports = class HTTPServer {

  /**
   * Sets up the server, routes and binds HTTP and HTTPs sockets
   * @param {object} credentials - private and public key file paths
   * @param {object} app
   */
  constructor(credentials, app) {
    this.app = app;

    this.jwt = new JwtToken(config.jwtSecret);
    this.oauth = new OAuth();

    this.enableHttpRedirect();
    this.specifyRoutes();

    // HTTP server, just to redirect to HTTPS
    http.createServer(app).listen(8081);

    // HTTPS server
    this.httpsServer = https.createServer(credentials, app);
    this.httpsServer.listen(8080);
  }

  specifyRoutes() {
    this.app.get('/', (req, res) => this.oAuthAuthorize(res));
    this.app.use(express.static('public'));
    this.app.get('/callback', (req, res) => this.oAuthCallback(req, res));

    this.router = express.Router();
    this.router.use(this.jwtVerify);
    this.app.use('/api', this.router);
    this.router.use('/runs', this.runs);
  }

  enableHttpRedirect() {
    this.app.use(function(req, res, next) {
      if (!req.secure) {
        return res.redirect('https://' + req.headers.host + req.url);
      }
      next();
    });
  }

  oAuthAuthorize(res) {
    res.redirect(this.oauth.authorizationUri);
  }

  oAuthCallback(req, res) {
    const emitter = new EventEmitter();
    this.oauth.oAuthCallback(emitter, req.query.code);
    emitter.on('userdata', function(data) {
      data.token = this.jwt.generateToken(data.personid, 1);
      return res.status(200).send(this.renderPage('public/index.tpl', data));
    }.bind(this));
  }

  renderPage(page, data) {
    const template = fs.readFileSync(page).toString();
    return mustache.to_html(template, data);
  }

  get server() {
    return this.httpsServer;
  }

  jwtVerify(req, res, next) {
    // jwt.verify is called synchronously; to improve performance call it in async way
    const jwtFeedback = this.jwt.verify(req.query.token);
    if (jwtFeedback.success) {
      req.decoded = jwtFeedback.decoded;
      next();
    } else {
      return res.status(403).json(jwtFeedback);
    }
  }

  runs(req, res) {
    res.json({run: 123});
  }
};
