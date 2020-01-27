const jwt = require("jsonwebtoken");
const { jwtPrivateKey } = require("../config");

module.exports = {
  verify(token, options) {
    return new Promise(function(resolve, reject) {
      jwt.verify(token, jwtPrivateKey, options, function(error, decoded) {
        if (error) reject(error);
        else resolve(decoded);
      });
    });
  },
  sign(payload, options) {
    return new Promise(function(resolve, reject) {
      jwt.sign(payload, jwtPrivateKey, options, function(error, decoded) {
        if (error) reject(error);
        else resolve(decoded);
      });
    });
  }
};
