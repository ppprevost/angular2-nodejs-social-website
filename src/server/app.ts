import * as path from 'path';
import * as express from 'express';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import * as mongoose from 'mongoose';
import * as fs from 'fs';
const app = express();
const limiter = require('express-limiter')(app);
const expressValidator = require('express-validator');
app.use(expressValidator());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.set('port', (process.env.PORT || 3000));
app.use('/', express.static(path.join(__dirname, '/../../dist')));
limiter({
  method: 'all',
  total: 100,
  expire: 1000 * 60 * 60,
  lookup: 'connection.remoteAddress',
  onRateLimited: function (req, res, next) {
    next({message: 'Rate limit exceeded', status: 429});
  }
});

const dirEnv = path.join(process.cwd(), '/.env');
const contentEnv = 'MONGODB_URI=mongodb://localhost:27017/test \nMAILVERIF=Gmail \nURLVERIF=http://example.com/email-verification/${URL} \nMAILACCOUNT= \nMAILPASS= \nCLIENTID= \nACCESSTOKEN= \nREFRESHTOKEN= \nCLIENTSECRET= \nSECRET_TOKEN=social\nSECRET_KEYCAPTCHA= \nRECAPTCHA_MODULE=false \nEMAIL_VERIFICATION=false';
try {
  fs.statSync(dirEnv).isFile();
} catch (err) {
  if (err.code === 'ENOENT') {
    if (!process.env.MONGODB_URI) {
      console.log('environment file does not exist, please fulfill the information in the dot env file at the root folder');
      fs.writeFileSync(dirEnv, contentEnv, 'utf8')
    }
  }
}

dotenv.load({path: '.env'});
app.use(morgan('dev'));

mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection;
(<any>mongoose).Promise = global.Promise;
db.on('error', () => {
  console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});

db.once('open', function () {
  console.log('Connected to MongoDB');

  // all other routes are handled by Angular
  const server = app.listen(app.get('port'), function () {
    console.log('Angular 4 Full Stack listening on port ' + app.get('port'));
  });
  const io = require('socket.io')(server);
  const routes = require('./routes/routes.js')(app, io);
  app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, '/../../dist/index.html'));
  });
});
export {app};
