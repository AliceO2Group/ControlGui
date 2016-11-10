const config = require('./../config.json');
const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const oauth2 = require('simple-oauth2');
const mustache = require('mustache');
const EventEmitter = require("events").EventEmitter;

const JwtToken = require('./../jwt/token.js');

module.exports = class HTTPServer {

  constructor(credentials, app) {
    this.app = app;

    this.jwt = new JwtToken(config.jwtSecret);
 
    this.oAuthInitConfiguration();
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
    this.app.use(function (req, res, next) {
      if (!req.secure) {
        return res.redirect('https://' + req.headers.host + req.url);
      }
      next();
    });
  }

  oAuthInitConfiguration() {
    this.oauthCreds = oauth2.create({
      client: {
        id: config.oAuth.id,
        secret: config.oAuth.secret,
      },
      auth: {
        tokenHost: config.oAuth.tokenHost,
        tokenPath: config.oAuth.tokenPath,
        authorizePath: config.oAuth.authorizePath
      },
    });

    this.authorizationUri = this.oauthCreds.authorizationCode.authorizeURL({
      redirect_uri: config.oAuth.redirect_uri,
      scope: config.oAuth.scope,
      state: config.oAuth.state
    });  
  }

  oAuthAuthorize(req, res) {
    res.redirect(this.authorizationUri);
  }

  oAuthCallback(req, res) {
    const code = req.query.code;
    const options = {
      code,
      redirect_uri: config.oAuth.redirect_uri
    };

    this.oauthCreds.authorizationCode.getToken(options, function(error, result) {
      if (error) {
        console.error('Access Token Error', error.message);
        return res.json(error.message);
      }

      var oAuthToken = this.oauthCreds.accessToken.create(result);
      var emitter = new EventEmitter();
      this.oAuthGetUserDetails(oAuthToken.token.access_token, emitter);
      emitter.on('userdata', function(data) {
        data.token = this.jwt.generateToken(data.personid, 1);
        return res.status(200).send(this.renderPage('public/index.tpl', data));
      }.bind(this));
    }.bind(this));    
  }
  
  renderPage(page, data) {
    var template = fs.readFileSync(page).toString();
    return mustache.to_html(template, data);
  }

  get server() {
    return this.httpsServer;
  }

  oAuthGetUserDetails(token, emitter) {
    var postOptions = {
      host: 'oauthresource.web.cern.ch',
      port: 443,
      path: '/api/User',
      method: 'GET',
      headers: {
          'Content-Type': 'text',
          'Authorization': 'Bearer ' + token
      }
    };
    var postRequest = https.request(postOptions, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
          return emitter.emit('userdata', JSON.parse(chunk));
      });
      res.on('error', function (e) {
        console.log(e);
      });
    });

    postRequest.write('');
    postRequest.end();
  }

  jwtVerify(req, res, next) {
    var jwtFeedback = this.jwt.verify(req.query.token);
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
}
