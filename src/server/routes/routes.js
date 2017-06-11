const jwt = require('jsonwebtoken');

module.exports = function (app, io) {
  // APIs

  //traitement socket
  io.on('connection', function (socket) {
    console.log("connection socket server ok");
    socket.emit('news', {hello: 'bienvenue sur mon reseau'});

    socket.on('disconnect', () => {
      console.log('user close the socket connection' + socket.id);
      usersController.deleteSocketIdDB(socket.id)
    });
  });

  let authenticationController = require('../controllers/authentication-controller')(io);
  let profileController = require('../controllers/profile-controller')(io);
  let wasteController = require('../controllers/waste-controller')(io);
  let usersController = require('../controllers/users-controller')(io);
  const cors = require('cors');
  let corsOptions = {
    origin: ["http://127.0.0.1:3000", "http://127.0.0.1:4200", "http://localhost:3000"],
    optionsSuccessStatus: 200
  };

  let jwtAuth = (req, res, next) => {
    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
    if (token) {
      try {
        var decoded = jwt.decode(token, process.env.SECRET_TOKEN);

        // if (decoded.exp <= Date.now()) {
        //   res.end('Access token has expired', 400);
        // }
        // handle token here

      } catch (err) {
        return res.end('no good token', 400);
      }
    } else {
      if (req.url == '/api/verif' || req.url == '/api/user/signup' || req.url == '/api/user/login') {
        next();
      } else {
        res.end('no token provided', 400);
      }

    }
  };

  // app.all('/api/*', jwtAuth);

//Route
//Authentication
  app.post('/api/verif', authenticationController.emailVerif);
  app.post('/api/user/signup', authenticationController.signup);
  app.get('/api/user/resendVerifEmail/:email', authenticationController.resendVerificationEmail);
  app.post('/api/user/login', authenticationController.login);
  app.get('/api/user/validCaptcha/:token', authenticationController.validCaptcha);
  app.post('/api/user/refreshSocketId', authenticationController.refreshSocketIdOfConnectedUsers);
  app.post('/api/user/refreshUserData', authenticationController.refreshUserData);
  app.post('/api/user/logout', usersController.deconnection);

//Profile profileController.updatePhoto
  app.options('api/upload', cors(corsOptions)); // enable pre-flight request for request
  app.post('/api/upload', profileController.updatePhoto);
  app.post('/api/profile/updateChamp', profileController.updateChamp);
  app.post('/api/profile/updatePassword', profileController.updatePassword);
  app.delete('/api/profile/deleteAccount/:id', profileController.deleteAccount);
//Waste
  app.post('/api/waste/getPost', wasteController.getPost);
  app.post('/api/waste/listOfFriend', wasteController.listOfFriends);
  app.post('/api/waste/sendPost', wasteController.sendPost);
  app.get('/api/waste/deletePost/:wasteId', wasteController.deletePost);
  app.post('/api/waste/sendComments', wasteController.sendComments);
  app.post('/api/waste/getCommentary', wasteController.getCommentary);

//User

  app.get('/api/users/uploadPicture/:id', usersController.uploadPicture);
  app.delete('/api/users/deleteAllPicture/:id', usersController.deleteAllPictures);
  app.get('/api/users/get', usersController.getUsers);
  app.post('/api/users/follow', usersController.followUser);
  app.post('/api/users/follow', usersController.followUser);
  app.post('/api/users/followOk', usersController.followUserOk);
  app.post('/api/users/unfollow', usersController.unfollowUser);
  app.post('/api/users/getThisUsers', usersController.getThisUser);

};

