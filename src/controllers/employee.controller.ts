import * as mongoose from 'mongoose';
import { EmployeeSchema } from '../models/employee-schema';
import { Request, Response } from 'express';
const Employee = mongoose.model('Employee', EmployeeSchema);
export class EmployeeController {

    public addNewEmployee(req: Request, res: Response) {
        req.body._user_id = req.body.user._id;
        let newEmployee = new Employee(req.body);
        newEmployee.save((err, employee) => {
            if (err) {
                console.log('error' , err);
                res.send(err);
            }
            console.log('rs', employee);
            res.json(employee);
        });
    }
    public getEmployees(req: Request, res: Response) {
        Employee.find({ _user_id: req.body.user._id })
        .then(employee=>{
            res.json(employee);
        })
        .catch(e=>{
            res.send(e);
        });
    }

    public getEmployeeByID(req: Request, res: Response) {
        Employee.findById(req.params.employeeId).then(employee=>{
            res.json(employee);
        }).catch(e=>{
            res.send(e);
        })
    }
    public updateEmployee(req: Request, res: Response) {
       
        req.body._user_id = req.body.user._id;
        Employee.findOneAndUpdate({ _id: req.params.employeeId }, req.body, { new: true })
        .then(employee=>{
            res.send(employee);
        }).catch(e=>{
            res.send(e);
        });
    }
    public deleteEmployee(req: Request, res: Response) {
        Employee.deleteOne({ _id: req.params.employeeId }).then(
            () => {
                res.send({ Status: 1, statusVal: 'sucess' });
            }, () => {
                res.json({ error: 'delete failed' });
            }
        );
    }
}
