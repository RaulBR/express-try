import * as mongoose from 'mongoose';
import * as validator from 'validator'
import * as jwt from 'jsonwebtoken';
import * as _ from 'lodash'
import * as bcrypt from 'bcryptjs'

const Schema = mongoose.Schema;
export const UserSchema = new Schema({

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


UserSchema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();
    return _.pick(userObject, '_id', 'email', 'token');

}
UserSchema.methods.generateAuthToken = function () {
    let user = this;
    let access = 'auth'
    let token = jwt.sign({ _id: user._id.toHexString(), access }, 'abc123').toString();
    user.tokens = user.tokens.concat({ access, token });
    return user.save().then(() => {
        return token;
    });
}
UserSchema.statics.findByToken = function (token) {
    let User = this;
    let decoded;
    try {
        decoded = jwt.verify(token, 'abc123');
    } catch (e) {
        return Promise.reject();
    }
    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    })
}

UserSchema.statics.removeToken = function (token, id) {
    let User = this;
    return User.updateOne(
        {
            _id: id
        },
        {
            $pull: {
                "tokens": {
                    token: token
                }
            }
        })
}
UserSchema.statics.findByCredentials = function (email, password) {
    let User = this;
    return User.findOne({ email }).then((user) => {
        if (!user) {
            return Promise.reject();
        }
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    resolve(user);
                } else {
                    reject();
                }
            });
        });
    })
};
UserSchema.pre('save', function (next) {
    var user = this;
    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            })
        });

    } else {
        next();
    };
});