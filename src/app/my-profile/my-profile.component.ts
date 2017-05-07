import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {DataService} from '../services/data.service';
import {AuthService} from '../services/auth.service';
import {Params, ActivatedRoute} from '@angular/router';
import {WasteComponent} from '../utils/waste/waste.component';
import {Compiler} from '@angular/core';

interface User {
  bio: string,
  _id: string,
  email: string,
  gender: string,
}

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})

export class MyProfileComponent implements OnInit, OnDestroy {
  user;
  id: string;
  images;
  isLoading = true;
  wasters;
  typeWaste: string;
  newWaste;
  actualUser;
  uploadPicture: string[] = [];
  @ViewChild(WasteComponent) wasteComponent: WasteComponent;

  constructor(private _compiler: Compiler, private auth: AuthService, private activatedRoute: ActivatedRoute, private data: DataService) {
  }

  ngOnInit() {
    // this.user = this.activatedRoute.snapshot.data['user'];
    return this.getThisUser();
  }

  ngOnChanges(changes) {
    console.log("dd", changes)
  }

  ngOnDestroy() {

  }

  getThisUser() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params['id'];
      if (this.id != this.auth.user._id) {
        this.data.getThisUser(this.id).subscribe(following => {
          this.user = following.json();
          this.actualUser = this.auth.user;
          this.getFollowerImage(this.user);
          this.getPictureUser(this.user._id);
        });
      } else {
        this.user = this.actualUser = this.auth.user;
        this.getPictureUser(this.user._id);
        this.getFollowerImage(this.user)
      }
    });
  };

  getFollowerImage(user) { // avatar from other friends
    if (user && user.following && user.following.length > 0) {
      return this.data.ListOfFriends(user).subscribe((elem) => {
        this.images = elem.json();
      })
    }
  }

  /**
   * uploaded Image
   * @param userId
   * @returns {Subscription}
   */
  getPictureUser(userId: string) {
    return this.data.getYourOwnPicture(userId)
      .map(res => res.json())
      .subscribe(data => {
          this.uploadPicture = data
        },
        (err) => console.log(err),
        () => this.isLoading = false)
  }

  deleteAllPictureUser() {
    return this.data.deleteAllPicture(this.auth.user._id).subscribe(
      data => {
        this.auth.callRefreshUserData(data.json());
        this._compiler.clearCache();
        this.uploadPicture = []
      },
      err => console.log(err))
  }

  sendWaste() {
    let request = {
      user: this.auth.user.username,
      userId: this.auth.user._id,
      userType: this.typeWaste || 'public',
      content: this.newWaste
    };
    return this.data.sendWaste({request: request}).map(res => res.json())
      .subscribe(data => {
          this.newWaste = '';
        },
        (err => console.log(err)),
        () => this.wasteComponent.getPosts()); // une fois// qu'on a bien enregfistré on rappelle la méthode getost du component child
  }

}
