import * as path from 'path';
import * as express from 'express';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import {redirectHTTPS} from './utils/utils';
import {RouterApp} from './routes/routes';
import * as mongoose from 'mongoose';

const expressValidator = require('express-validator');

class ServerApp {
  private app: express.Application;
  private io: any;
  private port: number;
  private limiter: any;

  constructor() {
    this.app = express();
    this.limiter = require('express-limiter')(this.app);
    this.app.use(redirectHTTPS());
    this.app.use(expressValidator());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({extended: false}));
    this.app.set('port', (process.env.PORT || 3000));
    this.app.use('/', express.static(path.join(__dirname, './../')));
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
    this.databases();
  }

  databases() {
    const dotenv = require('dotenv');
    dotenv.config({path: '.env'});
    (<any>mongoose).Promise = global.Promise;
    let mongodb: any = mongoose.connect(process.env.MONGODB_URI, {useMongoClient: true});
    mongodb.then(db => {
      console.log('Connected to MongoDB on', db.host + ':' + db.port);
      // all other routes are handled by Angular
      const server = this.app.listen(this.app.get('port'), () => {
        console.log('Angular 4 Full Stack listening on port ' + this.app.get('port'));
      });
      this.io = require('socket.io')(server);
      const routes = new RouterApp(this.app, this.io);
      routes.routing();
      this.app.get('/*', function (req, res) {
        res.sendFile(path.join(__dirname, './../index.html'));
      });
    }).catch(err => {
      console.log('MongoDB Connection Error. Please make sure that MongoDB is running.')
      console.error(err)
    });
  }
}

export const serverExpress = new ServerApp();


