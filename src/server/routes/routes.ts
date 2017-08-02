import {ProfileController} from '../controllers/profile-controller';
import {UserController} from '../controllers/users-controller';
import {WasteController} from '../controllers/waste-controller';
import {AuthentificationController} from '../controllers/authentication-controller';
import {Router} from 'express';

export class RouterApp {
  profileController;
  usersController;
  authenticationController;
  wasteController;
  private app;
  private router: Router;

  constructor(app, io) {
    this.router = Router();
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

  routing() {
    // APIs
// Route
// Authentication
    this.app.post('/api/verif', this.authenticationController.emailVerif);
    this.app.post('/api/user/signup', this.authenticationController.signup);
    this.app.get('/api/user/resendVerifEmail/:email', this.authenticationController.resendVerificationEmail);
    this.app.post('/api/user/login', this.authenticationController.login);
    this.app.get('/api/user/validCaptcha/:token', this.authenticationController.validCaptcha);
    this.app.post('/api/user/refreshSocketId', this.authenticationController.refreshSocketIdOfConnectedUsers);
    this.app.post('/api/user/refreshUserData', this.authenticationController.refreshUserData);
    this.app.post('/api/user/logout', this.usersController.deconnection);

// Profile profileController.updatePhoto
    // app.options('api/upload', cors(corsOptions)); // enable pre-flight request for request
    this.app.post('/api/upload', this.profileController.updatePhoto);
    this.app.post('/api/profile/updateChamp', this.profileController.updateChamp);
    this.app.post('/api/profile/updatePassword', this.profileController.updatePassword);
    this.app.delete('/api/profile/deleteAccount/:id', this.profileController.deleteAccount);
// Waste
    this.app.post('/api/waste/getPost', this.wasteController.getPost);
    this.app.post('/api/waste/sendPost', this.wasteController.sendPost);
    this.app.delete('/api/waste/deletePost/:wasteId/:commentId?', this.wasteController.deletePost);
    this.app.post('/api/waste/sendComments', this.wasteController.sendComments);
    this.app.post('/api/waste/getCommentary', this.wasteController.getCommentary);
    this.app.get('/api/waste/likeThisPostOrComment/:wasteId/:commentId?', this.wasteController.likeThisPostOrComment);

// User
    this.app.get('/api/users/uploadPicture/:id', this.usersController.uploadPicture);
    this.app.delete('/api/users/deleteAllPicture/:id', this.usersController.deleteAllPictures);
    this.app.get('/api/users/get', this.usersController.getUsers);
    this.app.post('/api/users/follow', this.usersController.followUser);
    this.app.post('/api/users/getListOfFriends', this.usersController.getlistOfFriends);
    this.app.post('/api/users/followOk', this.usersController.followUserOk);
    this.app.post('/api/users/unfollow', this.usersController.unfollowUser);
    this.app.post('/api/users/getThisUsers', this.usersController.getThisUser);
  };
}



