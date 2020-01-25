const jwt = require("../services/jwt");
const config = require("../config");

async function authMiddleware(req, res, next) {
  const authHeader = req.headers["x-auth-token"];
  if (!authHeader) return next({ status: 401 });

  const token = authHeader;

  try {
    const tokenPayload = await jwt.verify(token, config.jwtPrivateKey);
    res.locals = tokenPayload;
    next();
  } catch (e) {
    return next({ status: 401 });
  }
}

module.exports = authMiddleware;
