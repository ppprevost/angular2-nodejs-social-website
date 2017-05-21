import {Component, OnInit, OnDestroy, ViewContainerRef} from '@angular/core';
import {DataService} from './services/data.service';
import {AuthService} from './services/auth.service';
import {FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import{Router} from '@angular/router';
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';
import {SocketService} from './services/socket.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [SocketService]
})

export class AppComponent implements OnInit, OnDestroy {
  private loginUser: FormGroup;
  private loginAndSocket;
  private email = new FormControl('', Validators.required);
  private password = new FormControl('', Validators.required);
  private connection;
  private connectionOfUser;

  user;

  constructor(private socket: SocketService, public auth: AuthService, private toastyService: ToastyService, private toastyConfig: ToastyConfig, private data: DataService, private addUserForm: FormBuilder, private router: Router, vcr: ViewContainerRef) {
    this.toastyConfig.theme = 'material';

  }

  ngOnInit() {

    this.loginUser = this.addUserForm.group({
      email: this.email,
      password: this.password
    });

    if (this.loggedIn()) {
      this.initSocket()
    }
  }

  ngOnDestroy() {
    this.connectionOfUser.unsubscribe();
    this.connection.unsubscribe();
  }

  loginAccount() {
    this.loginAndSocket = this.loginUser.value;
    this.loginAndSocket.socketId = this.socket.socket.id;
    this.auth.loginAccount(this.loginAndSocket).subscribe(
      data => {
        console.log(data);
        this.router.navigate(['./']);
        this.initSocket();
      },
      err => {
        if (typeof err.json() == 'string') {
          this.toastyService.error(err.json())
        } else {
          if (Array.isArray(err.json())) {
            this.toastyService.error(err.json()[0].msg)
          } else {
            this.toastyService.error(err.json().msg)
          }
        }
      });
  }

  logOut() {
    console.log("click sur logout avec socket");
    this.data.logOut(this.auth.user._id, localStorage.token).subscribe(res => {
      console.log(res);
      localStorage.clear();
      this.router.navigate(['./']);
      var toastOptions: ToastOptions = {
        title: "Deconnection",
        msg: "See you soon !",
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
    })
  }

  loggedIn() {
    return this.auth.loggedIn()
  }

  initSocket() {
    this.connection = this.socket.socketFunction("getNewPost")
      .subscribe(message => {
        console.log(message)
        this.toastyService.info({title: 'you have a new post !', msg: message.content})
    });
    this.connectionOfUser = this.socket.socketFunction("connect").subscribe(connection => {
      this.auth.callRefreshUserData();
      this.data.refreshSocketIdOfConnectedUsers(this.auth.user._id, this.socket.socket.id,localStorage.token).subscribe((data) => {
        console.log(data)

      });
    });
  }
}
