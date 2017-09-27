import * as path from 'path';
import * as express from 'express';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import {RouterApp} from './routes/routes';
import * as mongoose from 'mongoose';
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
    dotenv.config({path: '.env'});
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
        res.sendFile(path.join(__dirname, './../index.html'));
      });
    });
  }
}
const serverExpress = new Server();
export {serverExpress};
