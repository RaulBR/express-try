import * as express from "express";
import * as bodyParser from "body-parser";
import { Routes } from "./routes/routes";
import * as mongoose from "mongoose";
;
export class App {
    
    //public mongoUrl: string = 'mongodb://mongodb:27017/MyDb';
   
    public mongoUrl: string = 'mongodb+srv://dbUser:Paroleamea1!@cluster0-rsbxh.mongodb.net/test?retryWrites=true&w=majority';
    public app: express.Application;
    public routePrv: Routes = new Routes();
    constructor() {
        this.app = express();
        this.config();     
        this.routePrv.routes(this.app);  
        this.mongoSetup();   
    }

    private config(): void{
        // support application/json type post data
        this.app.use(bodyParser.json());
        //support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({ extended: false }));
        

        this.app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
            if(req.method != "OPTIONS"){
                console.log(req.method,':', req.path ,': ',req.body);
            }
            next();
          });
    }
    private mongoSetup(): void{
        mongoose.Promise = global.Promise;
        mongoose.set('useCreateIndex', true);
     
        mongoose.connect(this.mongoUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true
          })
          .then(() => {
            console.log('Mongo coneccted')
          })
          .catch(err => console.log(err))  
    }
}

export default new App().app; 