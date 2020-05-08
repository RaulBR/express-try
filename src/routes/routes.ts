import { Request, Response } from "express";
import { EmployeeController } from "../controllers/employee.controller";
import { UserController } from "../controllers/user.controller";
import  { AuthService } from "../service/auth.service"
import *  as path from 'path'
const allowedExt = [
    '.js',
    '.ico',
    '.css',
    '.png',
    '.jpg',
    '.woff2',
    '.woff',
    '.ttf',
    '.svg',
  ];
export class Routes {
    private employeeservice = new EmployeeController();
    private userService = new UserController();
    private auth = new AuthService();
    public routes(app): void {
  
        app.route('/')
            .get((req: Request, res: Response) => {
                res.status(200).send({
                    message: 'GET request successfulll!!!!'
                });
            });
        // Employee 
        app.route('/api/employee')
            // GET endpoint 
            .get(this.auth.authenticate,this.employeeservice.getEmployees)
            // POST endpoint
            .post(this.auth.authenticate,this.employeeservice.addNewEmployee);
        // Employee detail
        app.route('/api/employee/:employeeId')
            // get specific Employee
            .get(this.auth.authenticate,this.employeeservice.getEmployeeByID)
            // add specific Employee
            .post(this.auth.authenticate,this.employeeservice.updateEmployee)
            // delete specific Employee
            .delete(this.auth.authenticate,this.employeeservice.deleteEmployee);

        // USER
        app.route('/api/user')
            .post(this.userService.addUser)
            // USER PRIVATE ROUTE
            app.route('/api/user/login').post(this.userService.login);
            app.route('/api/user/me').post(this.userService.findByToken);
            app.route('/api/user/logout').delete(this.auth.authenticate,this.userService.logout);

    }
}