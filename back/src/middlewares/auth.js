const jwt = require("../services/jwt");
const config = require("../config");
const User = require("../application/models/User");

async function authMiddleware(req, res, next) {
  // autenticação em duas chaves
  const authHeader = req.headers["x-auth-token"];
  const authCookie = req.cookies.cookieToken;

  if (!authHeader || !authCookie) return next({ status: 401 });

  let userId;
  try {
    const headerPayload = await jwt.verify(authHeader, config.jwtPrivateKey);
    const cookiePayload = await jwt.verify(authHeader, config.jwtPrivateKey);

    if (
      !headerPayload ||
      !headerPayload.headerFragment ||
      !cookiePayload ||
      !cookiePayload.cookieFragment ||
      !headerPayload.user ||
      !headerPayload.user._id ||
      headerPayload.user._id !== cookiePayload.user._id
    )
      throw new Error();

    userId = headerPayload.user._id;
  } catch (e) {
    return next({ status: 401, message: "Token inválido" });
  }

  res.locals.user = await User.findById(userId);
  return next();
}

module.exports = authMiddleware;
