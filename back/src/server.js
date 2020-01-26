const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");

const errorMiddleware = require("./middlewares/error");
const notFoundMiddleware = require("./middlewares/notFound");
const authMiddleware = require("./middlewares/auth");

const authRoute = require("./routes/auth");
const foldersRoute = require("./routes/folders");
const documentsRoute = require("./routes/documents");

const app = express();

const rootRouter = express.Router();

rootRouter.get("/", function(req, res) {
  res.send({ message: "root" });
});

rootRouter.use("/auth", authRoute);
rootRouter.use("/folders", authMiddleware, foldersRoute);
rootRouter.use("/documents", authMiddleware, documentsRoute);

app.use(cors());
app.use(fileUpload());
app.use(express.json());
app.use(express.text());

app.use("/api", rootRouter);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
