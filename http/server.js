const config = require('./../config.json'),
  fs = require('fs'),
  http = require('http'),
  https = require('https'),
  express = require('express'),
  mustache = require('mustache'),
  EventEmitter = require('events').EventEmitter,

  JwtToken = require('./../jwt/token.js'),
  OAuth = require('./oauth.js');

module.exports = class HTTPServer {

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
    this.app.get('/', this.oAuthAuthorize.bind(this));
    this.app.use(express.static('public'));
    this.app.get('/callback', this.oAuthCallback.bind(this));

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

  oAuthAuthorize(req, res) {
    res.redirect(this.oauth.authorizationUri);
  }

  oAuthCallback(req, res) {
    let emitter = new EventEmitter();
    this.oauth.oAuthCallback(emitter, req.query.code);
    emitter.on('userdata', function(data) {
      data.token = this.jwt.generateToken(data.personid, 1);
      return res.status(200).send(this.renderPage('public/index.tpl', data));
    }.bind(this));
  }

  renderPage(page, data) {
    let template = fs.readFileSync(page).toString();
    return mustache.to_html(template, data);
  }

  get server() {
    return this.httpsServer;
  }

  jwtVerify(req, res, next) {
    // jwt.verify is called synchronously; to improve performance call it in async way
    let jwtFeedback = this.jwt.verify(req.query.token);
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
