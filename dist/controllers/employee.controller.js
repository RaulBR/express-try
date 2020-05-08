"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const employee_schema_1 = require("../models/employee-schema");
const Employee = mongoose.model('Employee', employee_schema_1.EmployeeSchema);
class EmployeeController {
    addNewEmployee(req, res) {
        req.body._user_id = req.body.user._id;
        let newEmployee = new Employee(req.body);
        newEmployee.save((err, employee) => {
            if (err) {
                console.log('error', err);
                res.send(err);
            }
            console.log('rs', employee);
            res.json(employee);
        });
    }
    getEmployees(req, res) {
        Employee.find({ _user_id: req.body.user._id })
            .then(employee => {
            res.json(employee);
        })
            .catch(e => {
            res.send(e);
        });
    }
    getEmployeeByID(req, res) {
        Employee.findById(req.params.employeeId).then(employee => {
            res.json(employee);
        }).catch(e => {
            res.send(e);
        });
    }
    updateEmployee(req, res) {
        req.body._user_id = req.body.user._id;
        Employee.findOneAndUpdate({ _id: req.params.employeeId }, req.body, { new: true })
            .then(employee => {
            res.send(employee);
        }).catch(e => {
            res.send(e);
        });
    }
    deleteEmployee(req, res) {
        Employee.deleteOne({ _id: req.params.employeeId }).then(() => {
            res.send({ Status: 1, statusVal: 'sucess' });
        }, () => {
            res.json({ error: 'delete failed' });
        });
    }
}
exports.EmployeeController = EmployeeController;
//# sourceMappingURL=employee.controller.js.map