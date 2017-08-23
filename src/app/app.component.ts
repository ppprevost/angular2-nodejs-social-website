import {Component, OnInit, OnDestroy, ViewContainerRef, ViewChild} from '@angular/core';
import {DataService} from './services/data.service';
import {CompleterService, CompleterData, RemoteData} from 'ng2-completer';
import {AuthService} from './services/auth.service';
import {FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import {Router} from '@angular/router';
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';
import {SocketService} from './services/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [SocketService]
})

export class AppComponent implements OnInit, OnDestroy {
  private loginUser: FormGroup;
  private loginAndSocket;
  private table = [{type: 'friendRequest', see: 'Friend Request'}, {
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
  user;

  constructor(private socket: SocketService,
              public auth: AuthService,
              private toastyService: ToastyService,
              private toastyConfig: ToastyConfig,
              private data: DataService,
              private addUserForm: FormBuilder,
              private router: Router,
              private completerService: CompleterService) {
    this.toastyConfig.theme = 'material';

  }

  ngOnInit() {
    this.loginUser = this.addUserForm.group({
      email: this.email,
      password: this.password
    });

    if (this.loggedIn()) {
      this.initSocket();
    }

  }

  ngOnDestroy() {
    this.connectionOfUser.unsubscribe();
    this.connection.unsubscribe();
    this.commentarySub.unsubscribe();
    // for (let i = 0; i < this.table.length; i++) {
    //   this['connection' + i].unsubscribe();
    // }
  }

  loginAccount() {
    this.loginAndSocket = this.loginUser.value;
    this.loginUser.value.email = this.loginUser.value.email.trim();
    this.loginAndSocket.socketId = this.socket.socket.id;
    this.auth.loginAccount(this.loginAndSocket).subscribe(
      data => {
        console.log(data);
        this.router.navigate(['./']);
        this.initSocket();
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
        .subscribe(waste => {
          this.auth.callRefreshUserData(waste);
          if (elem.type === 'friendRequest') {
            this.auth.countFriendRequest++;
            this.toastyService.info({title: 'new request from friend', msg: waste.username + ' : ' + elem.see});
          }
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

  private initSocket() {
    this.auth.callRefreshUserData();
    this.auth.user.following.forEach(elem => {
      if (elem.statut === 'requested') {
        this.auth.countFriendRequest++;
      }
    });
    // TODO search server side
    // auto completion
    // this.data.getUsers()
    //   .then(tableOfUsers => {
    //     tableOfUsers.subscribe(dataElement => {
    //       this.dataUser = this.completerService.local(dataElement.json(), 'username', 'username').imageField('image');
    //     });
    //   });
    this.dataUser = this.completerService.remote(null, 'username', 'username').imageField('image');
    this.dataUser.urlFormater(term => `api/users/get?token=${localStorage.token}&limitData=0&searchData=${term}`);

    // the socket is connected
    this.connectionOfUser = this.socket.socketFunction('connect')
      .subscribe(connection => {
        this.data.refreshSocketIdOfConnectedUsers(
          this.auth.user._id, this.socket.socket.id, localStorage.token)
          .subscribe((refreshStorage) => {
            this.socketMethodUse(this.table);
            console.log(refreshStorage);
            this.connection = this.socket.socketFunction('getNewPost').subscribe(message => {
              console.log(message);
              this.toastyService.info({title: 'you have a new post !', msg: message.content});
            });
            this.commentarySub = this.socket.socketFunction('newComments').subscribe(message => {
              this.toastyService.info({title: message.username + ' answered to your comment', msg: message.content});
            });
          });
      });
  }
}
