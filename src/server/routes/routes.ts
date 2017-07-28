import {Update} from '../controllers/profile-controller';

export default function (app, io) {
  // APIs

  // traitement socket
  io.on('connection', function (socket) {
    console.log("connection socket server ok");
    socket.emit('news', {hello: 'bienvenue sur mon reseau'});

    socket.on('disconnect', () => {
      console.log('user close the socket connection' + socket.id);
      usersController.deleteSocketIdDB(socket.id)
    });
  });

  const authenticationController = require('../controllers/authentication-controller')(io);
  const wasteController = require('../controllers/waste-controller')(io);
  const usersController = require('../controllers/users-controller')(io);
  //let utilsController = require('../utils/utils')(io);
  const cors = require('cors');
  let corsOptions = {
    origin: ["http://127.0.0.1:3000", "http://127.0.0.1:4200", "http://localhost:3000"],
    optionsSuccessStatus: 200
  };


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

  const oo = new Update(io);
  app.post('/api/upload', oo.updatePhoto);
  app.post('/api/profile/updateChamp', profileController.updateChamp);
  app.post('/api/profile/updatePassword', profileController.updatePassword);
  app.delete('/api/profile/deleteAccount/:id', profileController.deleteAccount);
//Waste
  app.post('/api/waste/getPost', wasteController.getPost);
  app.post('/api/waste/sendPost', wasteController.sendPost);
  app.delete('/api/waste/deletePost/:wasteId/:commentId?', wasteController.deletePost);
  app.post('/api/waste/sendComments', wasteController.sendComments);
  app.post('/api/waste/getCommentary', wasteController.getCommentary);
  app.get('/api/waste/likeThisPostOrComment/:wasteId/:commentId?', wasteController.likeThisPostOrComment);

//User


  app.get('/api/users/uploadPicture/:id', usersController.uploadPicture);
  app.delete('/api/users/deleteAllPicture/:id', usersController.deleteAllPictures);
  app.get('/api/users/get', usersController.getUsers);
  app.post('/api/users/follow', usersController.followUser);
  app.post('/api/users/getListOfFriends', usersController.getlistOfFriends);
  app.post('/api/users/followOk', usersController.followUserOk);
  app.post('/api/users/unfollow', usersController.unfollowUser);
  app.post('/api/users/getThisUsers', usersController.getThisUser);

};

