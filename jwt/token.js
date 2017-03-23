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
    this._secret = secret;
  }

  /**
   * Generates encrypted token with user id and access level
   * Sets expiration time and sings it using secret
   * @param {number} userId - CERN user id
   * @param {number} accessLevel - whether user can execute commands, etc..
   * @return {object} encrypted token - authentication token
   */
  generateToken(userId, accessLevel) {
    const user = {id: userId, access: accessLevel};
    const token = jwt.sign(user, this._secret, {
      expiresIn: '2m'
    });
    return token;
  }

  /**
   * Verifies user token using the same secret as in generateToken method
   * @param {object} token - token to be verified
   * @return {object} whether operation was successful, if so decoded data are passed as well
   */
  verify(token) {
    if (!token) {
      return {
        success: false,
        message: 'Token not provided'
      };
    }
    try {
      const decoded = jwt.verify(token, this._secret);
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
