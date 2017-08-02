import {ProfileController} from '../controllers/profile-controller';
import {UserController} from '../controllers/users-controller';
import {WasteController} from '../controllers/waste-controller';
import {AuthentificationController} from '../controllers/authentication-controller';

export class RouterApp {
  profileController;
  usersController;
  authenticationController;
  wasteController;
  private app;

  constructor(app, io) {
    // traitement socket
    this.app = app;
    this.profileController = new ProfileController(io);
    this.usersController = new UserController(io);
    this.authenticationController = new AuthentificationController(io);
    this.wasteController = new WasteController(io);
    io.on('connection', function (socket) {
      console.log('connection socket server ok');
      socket.emit('news', {hello: 'bienvenue sur mon reseau'});
      socket.on('disconnect', () => {
        console.log('user close the socket connection' + socket.id);
        this.usersController.deleteSocketIdDB(socket.id);
      });
    });
  }

  routing(app) {
    const profileController = new ProfileController(io);
    const usersController = new UserController(io);
    const authenticationController = new AuthentificationController(io);
    const wasteController = new WasteController(io);
    // APIs


// Route
// Authentication
    app.post('/api/verif', authenticationController.emailVerif);
    app.post('/api/user/signup', authenticationController.signup);
    app.get('/api/user/resendVerifEmail/:email', authenticationController.resendVerificationEmail);
    app.post('/api/user/login', authenticationController.login);
    app.get('/api/user/validCaptcha/:token', authenticationController.validCaptcha);
    app.post('/api/user/refreshSocketId', authenticationController.refreshSocketIdOfConnectedUsers);
    app.post('/api/user/refreshUserData', authenticationController.refreshUserData);
    app.post('/api/user/logout', usersController.deconnection);

// Profile profileController.updatePhoto
    // app.options('api/upload', cors(corsOptions)); // enable pre-flight request for request


    app.post('/api/upload', profileController.updatePhoto);
    app.post('/api/profile/updateChamp', profileController.updateChamp);
    app.post('/api/profile/updatePassword', profileController.updatePassword);
    app.delete('/api/profile/deleteAccount/:id', profileController.deleteAccount);
// Waste
    app.post('/api/waste/getPost', wasteController.getPost);
    app.post('/api/waste/sendPost', wasteController.sendPost);
    app.delete('/api/waste/deletePost/:wasteId/:commentId?', wasteController.deletePost);
    app.post('/api/waste/sendComments', wasteController.sendComments);
    app.post('/api/waste/getCommentary', wasteController.getCommentary);
    app.get('/api/waste/likeThisPostOrComment/:wasteId/:commentId?', wasteController.likeThisPostOrComment);

// User
    app.get('/api/users/uploadPicture/:id', usersController.uploadPicture);
    app.delete('/api/users/deleteAllPicture/:id', usersController.deleteAllPictures);
    app.get('/api/users/get', usersController.getUsers);
    app.post('/api/users/follow', usersController.followUser);
    app.post('/api/users/getListOfFriends', usersController.getlistOfFriends);
    app.post('/api/users/followOk', usersController.followUserOk);
    app.post('/api/users/unfollow', usersController.unfollowUser);
    app.post('/api/users/getThisUsers', usersController.getThisUser);
  };
}



