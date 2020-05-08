"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const routes_1 = require("./routes/routes");
const mongoose = require("mongoose");
;
class App {
    constructor() {
        //public mongoUrl: string = 'mongodb://mongodb:27017/MyDb';
        this.mongoUrl = 'mongodb://localhost:27017/db';
        this.routePrv = new routes_1.Routes();
        this.app = express();
        this.config();
        this.routePrv.routes(this.app);
        this.mongoSetup();
    }
    config() {
        // support application/json type post data
        this.app.use(bodyParser.json());
        //support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
            if (req.method != "OPTIONS") {
                console.log(req.method, ':', req.path, ': ', req.body);
            }
            next();
        });
    }
    mongoSetup() {
        mongoose.Promise = global.Promise;
        mongoose.set('useCreateIndex', true);
        mongoose.connect(this.mongoUrl, { useNewUrlParser: true });
    }
}
exports.App = App;
exports.default = new App().app;
//# sourceMappingURL=app.js.map