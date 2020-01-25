function errorMiddleware({ message, status }, req, res, next) {
  res.status(status).send(message && { error: message });
}

module.exports = errorMiddleware;
