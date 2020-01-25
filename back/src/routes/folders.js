const express = require("express");
const User = require("../application/models/User");
const Document = require("../application/models/Document");

const foldersRoute = express.Router();

foldersRoute.get("/", function(req, res) {
  const { user } = res.locals;
  return res.send(user.folders);
});

foldersRoute.get("/:id", async function(req, res, next) {
  const { requestUser } = res.locals;
  const { id } = req.params;

  let folder;
  try {
    const user = await User.findById(requestUser.id).select("+folders.items");
    folder = user.folders.id(id);
  } catch (e) {
    console.log(e);
    return next({ status: 500 });
  }

  if (!folder) return next({ status: 404, message: "Pasta não encontrada" });
  return res.send(folder);
});

foldersRoute.post("/", async function(req, res, next) {
  const { user } = res.locals;
  const { name } = req.body;

  if (typeof name !== "string" || name.length === 0)
    return next({ status: 400 });

  let exists;
  try {
    exists = await User.exists({ _id: user._id, "folders.name": name });
  } catch (e) {
    console.log(e);
    return next({ status: 500 });
  }

  if (exists) {
    return next({
      status: 400,
      message: "Você já possui uma pasta com esse nome"
    });
  }

  user.folders.push({ name });

  try {
    await user.save();
    return res.send(user.folders[user.folders.length - 1]);
  } catch (e) {
    console.log(e);
    return next({ status: 500 });
  }
});

foldersRoute.put("/:id", async function(req, res, next) {
  const { user } = res.locals;
  const { name } = req.body;
  const { id } = req.params;

  const folder = user.folders.id(id);
  if (!folder) return next({ status: 404, message: "Pasta não encontrada" });

  folder.name = name;

  try {
    await user.save();
    return res.send(user.folders.id(id));
  } catch (e) {
    console.log(e);
    return next({ status: 500 });
  }
});

foldersRoute.delete("/:id", async function(req, res, next) {
  const { user } = res.locals;
  const { id } = req.params;

  const folder = user.folders.id(id);
  if (!folder) return next({ status: 404, message: "Pasta não encontrada" });

  const removedFolder = user.folders.id(id).remove();
  try {
    await user.save();
    return res.send(removedFolder);
  } catch (e) {
    console.log(e);
    return next({ status: 500 });
  }
});

foldersRoute.get("/:id/docs", async function(req, res, next) {
  const { user } = res.locals;
  const { id } = req.params;

  const folder = user.folders.id(id);
  if (!folder) return next({ status: 404, message: "Pasta não encontrada" });

  try {
    const docs = await Document.find({ folder: folder.id });
    return res.send(docs);
  } catch (e) {
    console.log(e);
    return next({ status: 500 });
  }
});

module.exports = foldersRoute;
