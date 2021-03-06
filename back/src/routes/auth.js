const express = require("express");
const User = require("../application/models/User");
const jwt = require("../services/jwt");
const authMiddleware = require("../middlewares/auth");

const authRoute = express.Router();

authRoute.post("/", async function(req, res, next) {
  const { username, password } = req.body;
  if (typeof username !== "string" || typeof password !== "string")
    return next({ status: 400 });

  const user = await User.findOne({ username }).select("+passwordHash");
  if (!user || !(await user.authenticate(password))) {
    return next({ status: 404, message: "Verifique suas credenciais" });
  }

  const { _id, name } = user;
  const tokenPayload = { user: { _id, name } };
  try {
    const token = await jwt.sign(tokenPayload);
    return res.send({ token });
  } catch (e) {
    console.log("Erro ao criar token assinado", e);
    return next({ status: 500 });
  }
});

authRoute.post("/register", async function(req, res, next) {
  const { username, password, name } = req.body;
  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    typeof name !== "string"
  )
    return next({ status: 400 });

  if (await User.findOne({ username }))
    return next({ status: 400, message: "Este usuário já existe" });

  const user = await User.create({
    username,
    name,
    password,
    folders: [{ name: "Padrão" }]
  });
  user.passwordHash = undefined;
  return res.send(user);
});

authRoute.get("/logged", authMiddleware, async function(req, res, next) {
  return res.send(res.locals.user);
});

module.exports = authRoute;
