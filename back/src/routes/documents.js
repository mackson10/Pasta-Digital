const express = require("express");
const Document = require("../application/models/Document");
const User = require("../application/models/User");
// const fileUpload = require("express-fileupload");

const docsRoute = express.Router();

docsRoute.get("/:id", async function(req, res, next) {
  const { user } = res.locals;
  const { id } = req.params;

  const doc = await Document.findById(id);

  if (!doc || !user.folders.id(doc.folder))
    return next({ status: 404, message: "Documento não encontrado" });

  return res.send(doc);
});

docsRoute.post("/", async function(req, res, next) {
  const { user: requestUser } = res.locals;
  const { title, folderId } = req.body;

  const user = await User.findById(requestUser.id).select("+folders.items");
  const folder = user.folders.id(folderId);
  if (!folder) return next({ status: 404, message: "Pasta não encontrada" });

  const doc = await Document.create({ title, folder: folderId });
  folder.items.push(doc.id);
  await user.save();
  res.send(doc);
});

docsRoute.put("/:id", async function(req, res, next) {
  const { user } = res.locals;
  const { id } = req.params;
  const { content } = req.body;

  const doc = await Document.findById(id);
  if (!doc) return next({ status: 404, message: "Documento não encontrado" });

  const folder = user.folders.id(doc.folder);
  if (!folder) return next({ status: 403, message: "Operação não permitida" });

  doc.content = content;
  await doc.save();
  return res.send(doc); //
});

docsRoute.delete("/:id", async function(req, res, next) {
  const { user } = res.locals;
  const { id } = req.params;

  const doc = await Document.findById(id);
  if (!doc) return next({ status: 404, message: "Documento não encontrado" });

  const folder = user.folders.id(doc.folder);
  if (!folder) return next({ status: 403, message: "Operação não permitida" });

  await doc.remove();
  return res.send(doc);
});

module.exports = docsRoute;
