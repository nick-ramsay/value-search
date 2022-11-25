const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema ({
    googleId: String,
    givenName: String,
    familyName: String,
    displayName: String,
    photo: String,
    secret: String
  });

UserSchema.plugin(passportLocalMongoose);
UserSchema.plugin(findOrCreate);

const Users = mongoose.model("Users", UserSchema);

module.exports = Users;