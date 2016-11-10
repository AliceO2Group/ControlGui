const jwt = require('jsonwebtoken');

module.exports = class JwtToken {

  constructor(secret) {
    this.secret = secret;
  }

  generateToken(userId, accessLevel) {
    var user = { id: userId, access: accessLevel };
    var token = jwt.sign(user, this.secret, {
        expiresIn: '1m'
    });
    return token;
  }

  verify(token) {
    if (!token) {
      console.log('no token');
      return {
        success: false,
        message: 'No token provided'
      };
    }
    try {
      var decoded = jwt.verify(token, this.secret);
      return {
          success: true,
          decoded: decoded
        }; 
    } catch(err) {
      return {
        success: false,
        message: err.name
      };
    }
  }
}
