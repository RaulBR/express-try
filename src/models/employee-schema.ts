import * as mongoose from 'mongoose';
import * as _ from 'lodash'
const Schema = mongoose.Schema;

export const EmployeeSchema = new Schema({
    firstName: {
        type: String,
        required: 'Enter a first name'
    },
    lastName: {
        type: String,
        required: 'Enter a last name'
    },
    email: {
        type: String            
    },
    company: {
        type: String            
    },
    phone: {
        type: String            
    },
    _user_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    birthday:{
        type:Date
    },
    checked:{
        type:Boolean,
        required: 'Must agree'
    },

    created_date: {
        type: Date,
        default: Date.now
    }
});

EmployeeSchema.methods.toJSON = function () {
    let employee = this;
    let employeeObject = employee.toObject();
    return _.pick(
    employeeObject, 
    '_id', 
    'firstName',
    'lastName',
    'email',
    'company',
    'phone',
    'birthday',
    'checked',
    'created_date');

}