const http = require("http");
const mongoose = require("./mongoose");
const config = require("./config");
const app = require("./server");

initServer();

async function initServer() {
  if (await setupServer()) {
    http.createServer(app).listen(config.port, function() {
      console.log("Servidor ativo na porta " + config.port);
    });
  } else {
    console.log("Não foi possível iniciar ao servidor");
  }
}

async function setupServer() {
  const setupOk = await testDbConnection();
  return setupOk;
}

async function testDbConnection() {
  try {
    await mongoose();
    console.log("Conexão com o banco Ok");
    return true;
  } catch (e) {
    console.log("Erro ao conectar-se ao banco");
    return false;
  }
}
