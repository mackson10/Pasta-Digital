const express = require("express");
const errorMiddleware = require("./middlewares/error");
const notFoundMiddleware = require("./middlewares/notFound");

const app = express();

const rootRouter = express.Router();
rootRouter.get("/", function(req, res) {
  res.send({ message: "Root route" });
});

app.use(express.json());
app.use(express.text());

app.use("/api", rootRouter);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
