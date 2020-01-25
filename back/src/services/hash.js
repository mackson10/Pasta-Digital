const { Crypt, Compare } = require("password-crypt");
const { pwdHashSecret } = require("../config");

module.exports = {
  crypt(pwd) {
    return Crypt(pwdHashSecret, pwd);
  },
  verify(pwd, hash) {
    return Compare(pwdHashSecret, pwd, hash);
  }
};
