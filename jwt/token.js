const jwt = require('jsonwebtoken');

/**
 * Contains Java Web Token functionality: generate, verify
 * @author Adam Wegrzynek <adam.wegrzynek@cern.ch>
 */
module.exports = class JwtToken {
  /**
   * Stores secret
   * @constructor
   * @param {string} secret - secret to sign and verfy token
   */
  constructor(secret) {
    this.secret = secret;
  }

  /**
   * Generates encrypted token with user id and access level
   * Sets expiration time and sings it using secret
   * @param {number} userId - CERN user id
   * @param {number} accessLevel - whether user can execute commands, etc..
   * @return {object} encrypted token - authentication token
   */
  generateToken(userId, accessLevel) {
    const user = {id: userId, access: accessLevel},
      token = jwt.sign(user, this.secret, {
        expiresIn: '2m'
      });
    return token;
  }

  /**
   * Verifies user token using the same secret as in generateToken method
   * @param {object} token - token to be verified
   * @return {object} wether operation was successful, if so decoded data are passed as well
   */
  verify(token) {
    if (!token) {
      return {
        success: false,
        message: 'Token not provided'
      };
    }
    try {
      const decoded = jwt.verify(token, this.secret);
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
};
