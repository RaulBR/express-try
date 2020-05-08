import * as mongoose from 'mongoose';
import { UserSchema } from '../models/user-schema';
import { Request, Response } from 'express';
const User = mongoose.model('Users', UserSchema);

export class AuthService {
    public  authenticate(req:Request,res:Response,next) {
        let token = req.header('Authorization');
        User.findByToken(token).then((user)=>{
            if(!user){
                return Promise.reject({error:'Must be Loged in'});
            }
            req.body.user = user;
            req.body.token = token;
            next();
        }).catch((e)=>{
            res.status(401).send();
        });
    }
}