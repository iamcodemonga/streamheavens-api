const mongoose = require('mongoose');
// const mongoose = require("mongoose");

// @users dp, name, email, gender, birthday, country, password, created_at, updated_at
//@favourites thumbnail, titlr, length, series

const userSchema = new mongoose.Schema({
    googleId: String,
    dp: String,
    fullname: { type: String, required: true },
    email:  {type: String, unique: true, sparse: true, lowercase: true },
    gender: String,
    birthday: String,
    country: String,
    password:  String,
    favourites: [String]
}, { timestamps: true });

const users = mongoose.model('users', userSchema);

module.exports = users;