require("dotenv").config();

module.exports = {
  port: getFromEnvironment("PORT"),
  mongoConnString: getFromEnvironment("MONGO_CONN_STR"),
  jwtPrivateKey: getFromEnvironment("JWT_PRIVATE_KEY"),
  pwdHashSecret: getFromEnvironment("PWD_HASH_SECRET")
};

function getFromEnvironment(varName) {
  if (process.env[varName] === undefined) {
    throw new Error(
      `Variável de ambiente '${varName}' não definida. Verifique o arquivo .env`
    );
  }
  return process.env[varName];
}
