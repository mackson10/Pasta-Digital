const mongoose = require("mongoose");
const hash = require("../../services/hash");
const folderSchema = require("./Folder");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true, select: false },
  name: { type: String, required: true },
  folders: [folderSchema]
});

userSchema.virtual("password"); //

userSchema.pre("validate", async function() {
  if (this.password) this.passwordHash = await hash.crypt(this.password);
});

userSchema.method("authenticate", async function(password) {
  return hash.verify(password, this.passwordHash);
});

module.exports = mongoose.model("user", userSchema);
