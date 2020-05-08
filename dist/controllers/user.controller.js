"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const _ = require("lodash");
const user_schema_1 = require("../models/user-schema");
const User = mongoose.model('Users', user_schema_1.UserSchema);
class UserController {
    addUser(req, res) {
        let body = _.pick(req.body, ['email', 'password']);
        let user = new User(body);
        user.save()
            .then(() => {
            return user.generateAuthToken();
        })
            .then((token) => {
            user.token = token;
            res.header('Authorization', token).send(user);
        })
            .catch((e) => {
            console.log('here: ' + e);
            res.status(400).send(e);
        });
    }
    getUsers(req, res) {
        User.find({})
            .then(user => {
            res.json(user);
        })
            .catch(e => {
            res.send(e);
        });
    }
    getUserByID(req, res) {
        User.findById(req.params.userId)
            .then(user => {
            res.send(user);
        }).catch(e => {
            res.send(e);
        });
    }
    updateUser(req, res) {
        User.findOneAndUpdate({ _id: req.params.contactId }, req.body, { new: true })
            .then(user => {
            res.send(user);
        }).catch(e => {
            res.send(e);
        });
    }
    deleteUser(req, res) {
        User.remove({ _id: req.params.contactId })
            .then(user => {
            res.json({ message: 'Successfully deleted user!' });
        }).catch(e => {
            res.send(e);
        });
    }
    login(req, res) {
        let body = _.pick(req.body, ['email', 'password']);
        User.findByCredentials(body.email, body.password)
            .then(user => {
            return user.generateAuthToken().then((token) => {
                user.token = token;
                res.header('Authorization', token).send(user);
            });
        })
            .catch((e) => {
            res.status(400).send();
        });
    }
    logout(req, res) {
        User.removeToken(req.body.token, req.body.user._id)
            .then(() => {
            res.status(200).send();
        })
            .catch(e => {
            res.status(400).send(e);
        });
    }
    findByToken(req, res) {
        let token = req.header('Authorization') || req.header('authorization');
        User.findByToken(token).then((user) => {
            if (!user) {
                res.send({ status: 'fasle' });
            }
            else {
                res.send(user);
            }
        }).catch(() => {
            res.send({ status: 'fasle' });
        });
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map