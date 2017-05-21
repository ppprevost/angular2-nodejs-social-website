const http = require('http');
const path = require('path');
var express = require('express');
const multer = require('multer');
const morgan = require('morgan'); // logger
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const expressValidator = require('express-validator');
app.use(expressValidator());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.set('port', (process.env.PORT || 3000));
app.use('/', express.static(path.join(__dirname, '/../../dist')));

let dirEnv = path.join(process.cwd(), '/.env');
let contentEnv = "MONGODB_URI=mongodb://localhost:27017/test \nMAILVERIF=Gmail \nURLVERIF=http://example.com/email-verification/${URL} \nMAILACCOUNT= \nMAILPASS= \nCLIENTID= \nACCESSTOKEN= \nREFRESHTOKEN= \nCLIENTSECRET= \nSECRET_TOKEN=social";
try {
  fs.statSync(dirEnv).isFile()
} catch (err) {
  if (err.code == 'ENOENT') {
    if (!process.env.MONGODB_URI) {
      console.log('environment file does not exist, please fulfill the information in the dot env file at the root folder');
      fs.writeFileSync(dirEnv, contentEnv, 'utf8')
    }
  }
}
const dotenv = require('dotenv');
dotenv.load({path: '.env'});

app.use(morgan('dev'));
let mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI);
var db = mongoose.connection;
mongoose.Promise = global.Promise;
db.on('error', () => {
  console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});

db.once('open', function () {
  console.log('Connected to MongoDB');

  // all other routes are handled by Angular
  let server = app.listen(app.get('port'), function () {
    console.log('Angular 4 Full Stack listening on port ' + app.get('port'));
  });
  let io = require('socket.io')(server);
  const routes = require('./routes/routes.js')(app, io);
  app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, '/../../dist/index.html'));
  });


});


module.exports = app;
