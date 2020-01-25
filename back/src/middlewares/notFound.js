function notFoundMiddleware(req, res, next) {
  next({ status: 404, message: "Rota não encontrada" });
}

module.exports = notFoundMiddleware;
