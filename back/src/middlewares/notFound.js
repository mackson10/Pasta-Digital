function notFoundMiddleware(req, res, next) {
  next({ status: 404 });
}

module.exports = notFoundMiddleware;
