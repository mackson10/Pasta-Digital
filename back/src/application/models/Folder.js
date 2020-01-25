const { Schema, Types } = require("mongoose");

const folderSchema = new Schema({
  name: { type: String, required: true, unique: true }, //
  items: { type: [{ type: Types.ObjectId, ref: "Document" }], select: false }
});

module.exports = folderSchema;
