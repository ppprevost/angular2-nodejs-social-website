import * as path from 'path';
import * as express from 'express';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import {RouterApp} from './routes/routes';
import * as mongoose from 'mongoose';
import * as fs from 'fs';
// import * as expressValidator from 'express-validator';
const expressValidator = require('express-validator');

class Server {
  private app: express.Application;
  private io: any;
  private port: number;
  private limiter: any;

  constructor() {
    this.app = express();
    this.limiter = require('express-limiter')(this.app);
    this.app.use(expressValidator());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({extended: false}));
    this.app.set('port', (process.env.PORT || 3000));
    this.app.use('/', express.static(path.join(__dirname, './../dist')));
    this.app.use(morgan('dev'));

    this.limiter({
      method: 'all',
      total: 100,
      expire: 1000 * 60 * 60,
      lookup: 'connection.remoteAddress',
      onRateLimited: function (req, res, next) {
        next({message: 'Rate limit exceeded', status: 429});
      }
    });
    this.environment();
    this.databases();
  }

  databases() {
    mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection;
    (<any>mongoose).Promise = global.Promise;
    db.on('error', () => {
      console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
      process.exit(1);
    });

    db.once('open', () => {
      console.log('Connected to MongoDB');
      // all other routes are handled by Angular
      const server = this.app.listen(this.app.get('port'), () => {
        console.log('Angular 4 Full Stack listening on port ' + this.app.get('port'));
      });
      this.io = require('socket.io')(server);
      const routes = new RouterApp(this.app, this.io);
      routes.routing();
      this.app.get('/*', function (req, res) {
        res.sendFile(path.join(__dirname, './../dist/index.html'));
      });
    });
  }

  environment() {
    const dirEnv = path.join(process.cwd(), '/.env');
    dotenv.config({path: '.env'});
    const contentEnv = 'MONGODB_URI=mongodb://localhost:27017/test \nMAILVERIF=Gmail \nURLVERIF=http://example.com/email-verification/${URL} \nMAILACCOUNT= \nMAILPASS= \nCLIENTID= \nACCESSTOKEN= \nREFRESHTOKEN= \nCLIENTSECRET= \nSECRET_TOKEN=social\nSECRET_KEYCAPTCHA= \nRECAPTCHA_MODULE=false \nEMAIL_VERIFICATION=false';
    try {
      fs.statSync(dirEnv).isFile();
    } catch (err) {
      if (err.code === 'ENOENT') {
        if (!process.env.MONGODB_URI) {
          console.log('environment file does not exist, please fulfill the information in the dot env file at the root folder');
          fs.writeFileSync(dirEnv, contentEnv, 'utf8');
        }
      }
    }
  }
}

export default new Server();
