const https = require('https'),
  oauth2 = require('simple-oauth2'),
  config = require('./../config.json'),
  log = require('./../log.js');

module.exports = class OAuth {

  constructor() {
    this.oauthCreds = oauth2.create({
      client: {
        id: config.oAuth.id,
        secret: config.oAuth.secret
      },
      auth: {
        tokenHost: config.oAuth.tokenHost,
        tokenPath: config.oAuth.tokenPath,
        authorizePath: config.oAuth.authorizePath
      }
    });

    this.authorizationUri = this.oauthCreds.authorizationCode.authorizeURL({
      redirect_uri: config.oAuth.redirect_uri,
      scope: config.oAuth.scope,
      state: config.oAuth.state
    });
  }

  oAuthCallback(emitter, code) {
    const options = {
      code,
      redirect_uri: config.oAuth.redirect_uri
    };

    this.oauthCreds.authorizationCode.getToken(options, function(error, result) {
      if (error) {
        log.warn('Access Token Error', error.message);
        return error.message;
      }

      const oAuthToken = this.oauthCreds.accessToken.create(result);
      this.oAuthGetUserDetails(oAuthToken.token.access_token, emitter);
    }.bind(this));
  }

  /**
   * Queries user details using received access token
   * @param {string} token
   * @param {object} emitter
   */
  oAuthGetUserDetails(token, emitter) {
    const postOptions = {
      host: config.oAuth.resource.hostname,
      port: config.oAuth.resource.port,
      path: config.oAuth.resource.path,
      method: 'GET',
      headers: {
        'Content-Type': 'text',
        'Authorization': 'Bearer ' + token
      }
    };
    const postRequest = https.request(postOptions, function(res) {
      res.setEncoding('utf8');
      res.on('data', function(chunk) {
        return emitter.emit('userdata', JSON.parse(chunk));
      });
      res.on('error', function(e) {
        log.warn(e);
      });
    });

    postRequest.write('');
    postRequest.end();
  }
};
