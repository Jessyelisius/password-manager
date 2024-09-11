const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const reg = new Schema({
    username:{
        type: String,
        required: [true,"username is required"],
        minlength:[4,"username is too short"],
        maxlength:[15, "username too long"]
    },
    email:{
        type: String,
        required: [true, "email is required"],
        unique: true,
        match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"not a valid email address"]
    },
    password:{
        type: String,
        required: [true,"password is invalid"], 
    }
});

const userTable = mongoose.model('user_table', reg);

module.exports = userTable;