const mongoose = require("mongoose");
const hash = require("../../services/hash");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true, select: false },
  name: { type: String, required: true }
});

userSchema.virtual("password");

userSchema.pre("validate", async function(next) {
  this.passwordHash = await hash.crypt(this.password);
});

userSchema.method("authenticate", async function(password) {
  return hash.verify(password, this.passwordHash);
});

module.exports = mongoose.model("user", userSchema);
