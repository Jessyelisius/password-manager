const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userPwd = new Schema({
    user_id:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: [true,"Name is required"],
        maxlength: [30, "name is too long"]
    },
    purpose:{
        type: String,
        required: true,
        maxlength: [300, "characters too long"],
        // enum:["book","banking"]
    },
    password:{
        type: String,
        required: [true, "password is invalid"],
    },
    iv:{
        type: String,
        required: true
    },
    key:{
        type: String,
        required: true
    }
},{timestamps: true});

const userPassword  = mongoose.model('user_password', userPwd);

module.exports = userPassword;