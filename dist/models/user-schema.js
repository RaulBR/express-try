"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;
exports.UserSchema = new Schema({
    email: {
        type: String,
        requierd: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        requierd: true,
        minlength: 5
    },
    tokens: [{
            access: {
                type: String,
                requierd: true
            },
            token: {
                type: String,
                requierd: true
            }
        }],
    token: { type: String },
    created_date: {
        type: Date,
        default: Date.now
    }
});
exports.UserSchema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();
    return _.pick(userObject, '_id', 'email', 'token');
};
exports.UserSchema.methods.generateAuthToken = function () {
    let user = this;
    let access = 'auth';
    let token = jwt.sign({ _id: user._id.toHexString(), access }, 'abc123').toString();
    user.tokens = user.tokens.concat({ access, token });
    return user.save().then(() => {
        return token;
    });
};
exports.UserSchema.statics.findByToken = function (token) {
    let User = this;
    let decoded;
    try {
        decoded = jwt.verify(token, 'abc123');
    }
    catch (e) {
        return Promise.reject();
    }
    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};
exports.UserSchema.statics.removeToken = function (token, id) {
    let User = this;
    return User.updateOne({
        _id: id
    }, {
        $pull: {
            "tokens": {
                token: token
            }
        }
    });
};
exports.UserSchema.statics.findByCredentials = function (email, password) {
    let User = this;
    return User.findOne({ email }).then((user) => {
        if (!user) {
            return Promise.reject();
        }
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    resolve(user);
                }
                else {
                    reject();
                }
            });
        });
    });
};
exports.UserSchema.pre('save', function (next) {
    var user = this;
    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    }
    else {
        next();
    }
    ;
});
//# sourceMappingURL=user-schema.js.map