const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const resetPwd = new Schema({
    user_id:{
        type: String,
        required: true,
        unique: true
    },
    otp:{
        type: Number,
        required: true,
        min: 1000,
        max: 9999
    },
    expiresAt:{
        type: Date,
        default: Date.null,
        expires: "10m"
    }
},{timestamps: true});

const resetPassword = mongoose.model('reset_password', resetPwd);

module.exports = resetPassword;