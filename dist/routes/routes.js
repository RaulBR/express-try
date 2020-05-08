"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const employee_controller_1 = require("../controllers/employee.controller");
const user_controller_1 = require("../controllers/user.controller");
const auth_service_1 = require("../service/auth.service");
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
class Routes {
    constructor() {
        this.employeeservice = new employee_controller_1.EmployeeController();
        this.userService = new user_controller_1.UserController();
        this.auth = new auth_service_1.AuthService();
    }
    routes(app) {
        app.route('/')
            .get((req, res) => {
            res.status(200).send({
                message: 'GET request successfulll!!!!'
            });
        });
        // Employee 
        app.route('/api/employee')
            // GET endpoint 
            .get(this.auth.authenticate, this.employeeservice.getEmployees)
            // POST endpoint
            .post(this.auth.authenticate, this.employeeservice.addNewEmployee);
        // Employee detail
        app.route('/api/employee/:employeeId')
            // get specific Employee
            .get(this.auth.authenticate, this.employeeservice.getEmployeeByID)
            // add specific Employee
            .post(this.auth.authenticate, this.employeeservice.updateEmployee)
            // delete specific Employee
            .delete(this.auth.authenticate, this.employeeservice.deleteEmployee);
        // USER
        app.route('/api/user')
            .post(this.userService.addUser);
        // USER PRIVATE ROUTE
        app.route('/api/user/login').post(this.userService.login);
        app.route('/api/user/me').post(this.userService.findByToken);
        app.route('/api/user/logout').delete(this.auth.authenticate, this.userService.logout);
    }
}
exports.Routes = Routes;
//# sourceMappingURL=routes.js.map