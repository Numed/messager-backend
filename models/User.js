const db = require("mongoose");
const Schema = db.Schema;

const User = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  name: {
    type: String,
  },
  image: {
    type: String,
  },
  token: {
    type: String,
  },
  messages: {
    type: Object,
  },
  loginedByGoogle: {
    type: Boolean,
  },
  loginedByFacebook: {
    type: Boolean,
  },
  loginedByGitHub: {
    type: Boolean,
  },
});

module.exports = db.model("user", User);
