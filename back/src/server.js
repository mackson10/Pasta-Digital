const express = require("express");

const errorMiddleware = require("./middlewares/error");
const notFoundMiddleware = require("./middlewares/notFound");

const authRoute = require("./routes/auth");

const app = express();

const rootRouter = express.Router();

rootRouter.get("/", function(req, res) {
  res.send({ message: "Root route" });
});

rootRouter.use("/auth", authRoute);

app.use(express.json());
app.use(express.text());

app.use("/api", rootRouter);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
