const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  uname: String,
  email: {type:String,unique:true},
  password: String,
}, {
  collection: "AdminPageInfo"
});

mongoose.model("AdminPageInfo", userSchema);