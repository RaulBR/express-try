import * as bcrypt from 'bcryptjs'
export class HashingService {
    public hash(password){
        bcrypt.genSalt(10, (err,salt)=>{
              bcrypt.hash(password,salt,(err,hash)=>{
                return hash;
            })
        });
       
    }
    public checkPassword(password,hashPass){
        return bcrypt.compare(password,hashPass,(err,res)=>{
            return res;
        });
    }
}