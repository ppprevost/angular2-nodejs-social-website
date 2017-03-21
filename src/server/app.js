let express = require('express');
let http = require('http');
let path = require('path');
let fs = require('fs')

let morgan = require('morgan'); // logger
let bodyParser = require('body-parser');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
let expressValidator = require('express-validator');
let multer = require('multer');
let app = express();

app.set('port', (process.env.PORT || 3000));
app.use('/', express.static(__dirname + '/../../dist'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan('dev'));
app.use(expressValidator());
app.use('/uploads', express.static(__dirname + "/uploads"));
var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost:27017/test');
mongoose.connect('mongodb://heroku_q4bljjq9:20p457b4tk07tuj21dknafdfc8@ds135820.mlab.com:35820/heroku_q4bljjq9');
mongoose.connection.on('error', function () {
  console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});
var db = mongoose.connection;
mongoose.Promise = global.Promise;
let server = require('http').Server(app);
let io = require('socket.io').listen(server);
console.log(server);

try {
  var envi = JSON.parse(fs.readFileSync(`${process.cwd()}/src/server/env.json`, 'utf8'));
  process.env.url = envi.url;
  process.env.mail = envi.mail;
  process.env.pass = envi.pass;
} catch (err) {
  console.error("you have to create a env.json file in order to send email");
  fs.writeFileSync(`${process.cwd()}/src/server/env.json`, JSON.stringify({
    "url": "http://localhost:3000/email-verification/${URL}",
    "pass": "your messaging pass",
    "mail": "your smtp"
  }), 'utf8')
}

db.on('error', () => {
  console.error('connection error:');
  process.exit(1);
});

db.once('open', function () {
  console.log('Connected to MongoDB');

  // APIs

  let authenticationController = require('./controllers/authentication-controller')(io);
  let profileController = require('./controllers/profile-controller')(io);
  let wasteController = require('./controllers/waste-controller')(io);
  let usersController = require('./controllers/users-controller')(io);

  //Route
//Authentication
  app.post('/verif', authenticationController.emailVerif);
  app.post('/api/user/signup', authenticationController.signup);
  app.post('/api/user/login', authenticationController.login);
  app.post('/api/user/logout', usersController.deconnection);

//Profile profileController.updatePhoto
  app.post('/api/profile/updateChamp', profileController.updateChamp);
  app.post('/api/profile/editPhoto', multipartMiddleware, profileController.updatePhoto);
  app.post('/api/profile/editCover', profileController.updateCover);
  app.post('/api/profile/updatePassword', profileController.updatePassword);

//Waste
  app.post('/api/waste/get', wasteController.getPost);
  app.post('/app/waste/listOfFriend', wasteController.listOfFriends);

//User
  app.get('/api/users/get', usersController.getUsers);
  app.post('/api/users/follow', usersController.followUser);
  app.post('/api/users/followOk', usersController.followUserOk);
  app.post('/api/users/unfollow', usersController.unfollowUser);
  app.post('/app/users/getThisUsers', usersController.getThisUser);

  // all other routes are handled by Angular
  app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, '/../../dist/index.html'));
  });

  app.listen(app.get('port'), function () {
    console.log('Angular 2 Full Stack listening on port ' + app.get('port'));
  });
});

//traitement socket
io.on('connection', function (socket) {
  console.log("connection socket server ok");
  socket.emit('news', {hello: 'bienvenue sur mon reseau'});
  socket.on('sendPost', function (data, fn) {
    wasteController.sendPost(data, fn);
  });

  socket.on("deconnection", function (data, fn) {
    usersController.deconnection(data, fn);
  })
});

module.exports = app;
