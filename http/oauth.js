const https = require('https');
const oauth2 = require('simple-oauth2');
const config = require('./../config.json');

module.exports = class OAuth {

  constructor() {
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

  oAuthCallback(emitter, code) {
    const options = { 
      code,
      redirect_uri: config.oAuth.redirect_uri
    };  

    this.oauthCreds.authorizationCode.getToken(options, function(error, result) {
      if (error) {
        console.error('Access Token Error', error.message);
        return error.message;
      }   

      var oAuthToken = this.oauthCreds.accessToken.create(result);
      this.oAuthGetUserDetails(oAuthToken.token.access_token, emitter);
    }.bind(this));    
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
}
