const { Schema, model } = require("mongoose");

const docSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, default: "", select: false },
  folder: { type: Schema.Types.ObjectId, ref: "User.folders" }
});

module.exports = model("Document", docSchema);
