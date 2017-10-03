import {Component, OnInit, OnDestroy} from '@angular/core';
import {DataService} from './services/data.service';
import {Headers, RequestOptions} from '@angular/http'
import {CompleterService, RemoteData} from 'ng2-completer';
import {AuthService} from './services/auth.service';
import {FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';
import {SocketService} from './services/socket.service';
import {User} from './interface/interface';
import {Router, Event, NavigationStart, NavigationEnd, NavigationError, NavigationCancel} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [SocketService]
})

export class AppComponent implements OnInit, OnDestroy {
  private loginUser: FormGroup;
  private loginAndSocket;
  private table: any = [{type: 'friendRequest', see: 'Friend Request'}, {
    type: 'removeFriend',
    see: 'You\'re not friend anymore'
  }, {type: 'friendRequestAccepted', see: 'Friend Request Accepted'}];
  private email = new FormControl('', Validators.required);
  private password = new FormControl('', Validators.required);
  private connection;
  protected dataUser: RemoteData;
  private connectionOfUser;
  private commentarySub;
  protected searchUser: string;
  user: User;
  busy = true;

  constructor(private socket: SocketService,
              public auth: AuthService,
              private toastyService: ToastyService,
              private toastyConfig: ToastyConfig,
              private data: DataService,
              private addUserForm: FormBuilder,
              private router: Router,
              private completerService: CompleterService) {
    this.toastyConfig.theme = 'material';
    this.router.events.subscribe((routerEvent: Event) => {
      this.checkRouterEvent(routerEvent);
    });
  }

  checkRouterEvent(routerEvent: Event): void {
    if (routerEvent instanceof NavigationStart) {
      this.busy = true;
    } else {
      if (routerEvent instanceof NavigationEnd ||
        routerEvent instanceof NavigationCancel ||
        routerEvent instanceof NavigationError) {
        this.busy = false;
      }
    }
  }

  sendData(userInfo) {
    console.log(userInfo);
    if (userInfo) {
      this.router.navigate(['/my-profile', userInfo.originalObject._id]);
    }
  }

  ngOnInit() {
    this.loginUser = this.addUserForm.group({
      email: this.email,
      password: this.password
    });
    if (this.loggedIn()) {
      this.initSocketAndUserData();
    }

  }

  ngOnDestroy() {
    this.connectionOfUser.unsubscribe();
    this.connection.unsubscribe();
    this.commentarySub.unsubscribe();
    for (let i = 0; i < this.table.length; i++) {
      this['connection' + i].unsubscribe();
    }
  }

  loginAccount() {
    this.loginAndSocket = this.loginUser.value;
    this.loginUser.value.email = this.loginUser.value.email.trim();
    this.loginAndSocket.socketId = this.socket.socket.id;
    this.auth.loginAccount(this.loginAndSocket).subscribe(
      data => {
        console.log(data);
        this.router.navigate(['./']);
        this.initSocketAndUserData(data);
      },
      err => {
        if (typeof err.json() === 'string') {
          this.toastyService.error(err.json());
        } else {
          if (Array.isArray(err.json())) {
            this.toastyService.error(err.json()[0].msg);
          } else {
            this.toastyService.error(err.json().msg);
          }
        }
      });
  }

  private socketMethodUse(table) {
    table.forEach((elem, i) => {
      this['connection' + i] = this.socket.socketFunction(elem.type)
        .subscribe((waste: User) => {
          this.auth.callRefreshUserData(waste);
          if (elem.type === 'friendRequest') {
            this.auth.countFriendRequest++;
          }
          this.toastyService.info({title: elem.type, msg: waste.username + ' : ' + elem.see});
        });
    });
  }

  logOut() {
    console.log('click sur logout avec socket');
    this.data.logOut(this.auth.user._id).subscribe(res => {
      console.log(res);
      localStorage.clear();
      this.auth.countFriendRequest = 0;
      this.router.navigate(['./']);
      const toastOptions: ToastOptions = {
        title: 'Deconnection',
        msg: 'See you soon !',
        showClose: true,
        timeout: 5000,
        theme: 'material',
        onAdd: (toast: ToastData) => {
          console.log('Toast ' + toast.id + ' has been added!');
        },
        onRemove: function (toast: ToastData) {
          console.log('Toast ' + toast.id + ' has been removed!');
        }
      };
      this.toastyService.info(toastOptions);
    });
  }

  loggedIn() {
    return this.auth.loggedIn();
  }

  private friendRequested(user: User) {
    user.following.forEach(elem => {
      if (elem.statut === 'requested') {
        this.auth.countFriendRequest++;
      }
    });
  }

  /**
   * Launch socket io when data of the user is ready
   */
  private initSocketIo() {
    // the socket is connected
    this.connectionOfUser = this.socket.socketFunction('connect')
      .subscribe(connection => {
        console.log('connection of the socket', connection)
        this.data.refreshSocketIdOfConnectedUsers(
          this.auth.user._id, this.socket.socket.id, localStorage.token)
          .subscribe((refreshStorage) => {
            console.log(refreshStorage);
            this.socketMethodUsed();
          });
      });
  }

  private socketMethodUsed() {
    this.socketMethodUse(this.table);
    this.connection = this.socket.socketFunction('getNewPost').subscribe(message => {
      console.log(message);
      this.toastyService.info({title: 'you have a new post !', msg: message.content});
    });
    this.commentarySub = this.socket.socketFunction('newComments').subscribe(message => {
      this.toastyService.info({title: message.username + ' answered to your comment', msg: message.content});
    });
  }


  /**
   * Initialize the socket and the connection either synchonr if connected or asynchronous if not connected
   * @param logged
   */
  private initSocketAndUserData(userIsNowLogged?) {
    if (userIsNowLogged) {
      this.auth.callRefreshUserData(userIsNowLogged);
      this.friendRequested(userIsNowLogged);
      this.initSocketIo();
    } else {
      this.auth.callRefreshUserData(null, (user) => {
        this.friendRequested(user);
        this.initSocketIo();
      });
    }
    this.dataUser = this.completerService.remote(null, 'username', 'username')
      .imageField('image');
    this.dataUser.requestOptions(new RequestOptions({headers: new Headers({'authorization': 'Bearer ' + localStorage.token})}));
    this.dataUser.urlFormater(term => `api/users/get?limitData=0&searchData=${term}`);
  }
}
