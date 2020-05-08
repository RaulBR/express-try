import * as mongoose from 'mongoose';
import * as _ from 'lodash'
import { UserSchema } from '../models/user-schema';
import { Request, Response } from 'express';
const User = mongoose.model('Users', UserSchema);

export class UserController {

    public addUser(req: Request, res: Response) {
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
                console.log('here: ' + e)
                res.status(400).send(e)
            })
    }
    public getUsers(req: Request, res: Response) {
        User.find({})
            .then(user => {
                res.json(user);
            })
            .catch(e => {
                res.send(e);
            })
    }
    public getUserByID(req: Request, res: Response) {
        User.findById(req.params.userId)
            .then(user => {
                res.send(user);
            }).catch(e => {
                res.send(e);
            })

    }
    public updateUser(req: Request, res: Response) {
        User.findOneAndUpdate({ _id: req.params.contactId }, req.body, { new: true })
            .then(user => {
                res.send(user);
            }).catch(e => {
                res.send(e);
            })

    }
    public deleteUser(req: Request, res: Response) {
        User.remove({ _id: req.params.contactId })
            .then(user => {
                res.json({ message: 'Successfully deleted user!' });
            }).catch(e => {
                res.send(e);
            })

    }
    public login(req: Request, res: Response) {
        let body = _.pick(req.body, ['email', 'password']);
        User.findByCredentials(body.email, body.password)
            .then(user => {
                return user.generateAuthToken().then((token) => {
                    user.token = token;
                    res.header('Authorization', token).send(user);
                })
            })
            .catch((e) => {
                res.status(400).send();
            })

    }
    public logout(req: Request, res: Response) {
        User.removeToken(req.body.token, req.body.user._id)
            .then(() => {
                res.status(200).send();
            })
            .catch(e => {
                res.status(400).send(e);
            });

    }
    public findByToken(req: Request, res: Response) {
        let token = req.header('Authorization') || req.header('authorization');
        User.findByToken(token).then((user) => {
            if (!user) {
                res.send({ status: 'fasle' });
            } else {
                res.send(user);
            }

        }).catch(() => {
            res.send({ status: 'fasle' });
        });

    }

}