const jwt = require("jsonwebtoken");
const { jwtPrivateKey } = require("../config");

module.exports = {
  verify(token) {
    return new Promise(function(resolve, reject) {
      jwt.verify(token, jwtPrivateKey, {}, function(error, decoded) {
        if (error) reject(error);
        else resolve(decoded);
      });
    });
  },
  sign(payload) {
    return new Promise(function(resolve, reject) {
      jwt.sign(payload, jwtPrivateKey, {}, function(error, decoded) {
        if (error) reject(error);
        else resolve(decoded);
      });
    });
  }
};
