const jwt = require("../services/jwt");
const config = require("../config");
const User = require("../application/models/User");

async function authMiddleware(req, res, next) {
  const authHeader = req.headers["x-auth-token"];
  if (!authHeader) return next({ status: 401 });

  const token = authHeader;

  let userId;
  try {
    const tokenPayload = await jwt.verify(token, config.jwtPrivateKey);
    userId = tokenPayload.user._id;
  } catch (e) {
    return next({ status: 401, message: "Token inválido" });
  }

  try {
    res.locals.user = await User.findById(userId);
    return next();
  } catch (e) {
    console.log(e);
    return next({ status: 500 });
  }
}

module.exports = authMiddleware;
