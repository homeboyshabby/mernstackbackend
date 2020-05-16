var mongoose = require("mongoose");
var userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        maxlength: 32,
        trim: true
    },
    lastname:{
        type: String,
        maxlength: 32,
        trim: true
    },
    userinfo:{
        type: String,
        trim: true
    },
    email:{
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    password:{
        type: String,
        trim: true
    },
    salt: String,
    role:{
        type: Number,
        default: 0
    },
    purchases:{
        type: Array,
        default: []
    }
});

module.exports = mongoose.model("User", userSchema)
