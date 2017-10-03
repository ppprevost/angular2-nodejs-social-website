import {ProfileController} from '../controllers/profile-controller';
import {UserController} from '../controllers/users-controller';
import {WasteController} from '../controllers/waste-controller';
import {AuthentificationController} from '../controllers/authentication-controller';
import {Router, Application} from 'express';
import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';

export class RouterApp {
  private profileController: ProfileController;
  private usersController: UserController;
  private authenticationController: AuthentificationController;
  private io;
  private wasteController: WasteController;
  private app;
  private router: Router;

  /**
   * @constructor
   * @param {express.Application} app -express injection
   * @param {SocketServer} io -socket io
   */
  constructor(app: Application, io) {
    this.router = Router();
    // traitement socket
    this.app = app;
    this.io = io;
    this.profileController = new ProfileController(this.io);
    this.usersController = new UserController(this.io);
    this.authenticationController = new AuthentificationController(this.io);
    this.wasteController = new WasteController(this.io);
    this.io.on('connection', socket => {
      console.log('connection socket server ok');
      socket.emit('news', {hello: 'bienvenue sur mon reseau'});
      socket.on('disconnect', () => {
        console.log('user close the socket connection' + socket.id);
        this.usersController.deleteSocketIdDB(socket.id);
      });
    });
  }

  /**
   * MiddleWare to check if a user is connected thanks to JSON Web Token
   * @param req
   * @param res
   * @param next
   */
  checkIfUser(req, res, next) {
    let token: string;
    if (req.headers['authorization'] && req.headers['authorization'].split(' ')[1] !== null) {
      try {
        token = req.headers['authorization'].split(' ')[1];
      } catch (err) {
        token = req.query.token || req.body.token;
      }
    }
    if (token) {
      jwt.verify(token, process.env.SECRET_TOKEN, (err, decoded) => {
        if (err) {
          res.json({success: false, message: 'Failed to authenticate token.'});
        } else {
          // if everything is good, save to request for use in other routes
          req.decoded = decoded;
          next();
        }
      });
    } else {
      res.status(403).send({success: false, message: 'no token provided'});
    }
  };

  routing() {

    // const routingMatch = {
    //   authenticationController: 'user',
    //   profileController: 'profile',
    //   wasteController: 'waste',
    //   usersController: 'users'
    // };
    //
    // const routerJson = fs.readFileSync('./routes.json');
    // for (const prop in routerJson) {
    //   if (routerJson.hasOwnProperty(prop)) {
    //     routerJson[prop].forEach(elem => {
    //       this.app[elem.method](`api/${routingMatch[prop]}/${elem.name}, ` + elem.secure ? this.checkIfUser + ',' : '' + this[routerJson[prop]][elem.name]);
    //     });
    //   }
    // }

    // APIs
// Route
// Authentication
    this.app.post('/api/user/verif', this.authenticationController.emailVerif);
    this.app.post('/api/user/signup', this.authenticationController.signup);
    this.app.get('/api/user/resendVerifEmail/:email', this.authenticationController.resendVerificationEmail);
    this.app.post('/api/user/login', this.authenticationController.login);
    this.app.get('/api/user/validCaptcha/:token', this.authenticationController.validCaptcha);


// Profile profileController.updatePhoto
    // app.options('api/upload', cors(corsOptions)); // enable pre-flight request for request
    this.app.post('/api/profile/updatePhoto', this.checkIfUser, this.profileController.updatePhoto);
    this.app.post('/api/profile/updateChamp', this.checkIfUser, this.profileController.updateChamp);
    this.app.post('/api/profile/updatePassword', this.checkIfUser, this.profileController.updatePassword);
    this.app.delete('/api/profile/deleteAccount/:id', this.checkIfUser, this.profileController.deleteAccount);
// Waste
    this.app.post('/api/waste/getPost', this.checkIfUser, this.wasteController.getPost);
    this.app.post('/api/waste/sendPost', this.checkIfUser, this.wasteController.sendPost);
    this.app.delete('/api/waste/deletePost/:wasteId/:commentId?', this.checkIfUser, this.wasteController.deletePost);
    this.app.post('/api/waste/sendComments', this.checkIfUser, this.wasteController.sendComments);
    this.app.post('/api/waste/getCommentary', this.checkIfUser, this.wasteController.getCommentary);
    this.app.get('/api/waste/likeThisPostOrComment/:userId/:wasteId/:commentId?', this.checkIfUser, this.wasteController.likeThisPostOrComment);

// User
    this.app.get('/api/users/uploadPicture/:id', this.checkIfUser, this.usersController.uploadPicture);
    this.app.delete('/api/users/deleteAllPicture/:id/:pictureId', this.checkIfUser, this.usersController.deleteAllPictures);
    this.app.get('/api/users/get', this.checkIfUser, this.usersController.getUsers);
    this.app.post('/api/users/getListOfFriends', this.checkIfUser, this.usersController.getlistOfFriends);
    this.app.post('/api/users/followingFunction', this.checkIfUser, this.usersController.followingFunction);
    this.app.post('/api/users/getThisUsers', this.checkIfUser, this.usersController.getThisUser);
    this.app.post('/api/users/refreshSocketId', this.checkIfUser, this.usersController.refreshSocketIdOfConnectedUsers);
    this.app.post('/api/users/refreshUserData', this.checkIfUser, this.usersController.refreshUserData);
    this.app.post('/api/users/logout', this.checkIfUser, this.usersController.logout);
  };
}



