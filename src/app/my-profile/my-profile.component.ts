import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {DataService} from '../services/data.service';
import {AuthService} from '../services/auth.service';
import {Params, ActivatedRoute} from '@angular/router';
import {WasteComponent} from '../utils/waste/waste.component';
import {Compiler} from '@angular/core';
import {User} from '../interface/interface';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})

export class MyProfileComponent implements OnInit, OnDestroy {
  user: User;
  id: string;
  loading;
  isLoading = true;
  typeWaste: string;
  newWaste: string;
  actualUser: User;
  uploadPicture: string[] = [];
  @ViewChild(WasteComponent) wasteComponent: WasteComponent;
  getThisUserSub;

  constructor(private _sanitizer: DomSanitizer, private _compiler: Compiler, private auth: AuthService, private activatedRoute: ActivatedRoute, private data: DataService) {
  }

  ngOnInit() {
    return this.getThisUser();
  }

  ngOnDestroy() {
    this.getThisUserSub.unsubscribe();
  }

  getThisUser() {
    this.auth.user = this.activatedRoute.snapshot.data['user'].json();

    this.getThisUserSub = this.activatedRoute.params
      .subscribe((params: Params) => {
        this.id = params['id'];
        if (this.id !== this.auth.user._id) {
          this.data.getThisUser(this.id)
            .then(following => {
              this.user = following.json();
              this.actualUser = this.auth.user;
              this.getPictureUser(this.user._id);
            });
        } else {
          this.user = this.actualUser = this.auth.user;
          this.getPictureUser(this.user._id);
          this.user.following = this.user.following.filter(elem => {
            return elem.statut === 'accepted';
          });
        }
      });

  };

  /**
   * uploaded Image
   * @param userId
   * @returns {Subscription}
   */
  getPictureUser(userId: string) {
    return this.data.getYourOwnPicture(userId)
      .map(res => res.json())
      .subscribe(data => {
          this.uploadPicture = data;
        },
        (err) => console.log(err),
        () => this.isLoading = false);
  }

  /**
   * if a pictureId is present delete only one picture. If not, delete all picures !
   * @param {string} [pictureId] -picture to delete
   */
  deletePictureUser(pictureId?) {
    return this.data.deletePictures(this.auth.user._id, pictureId)
      .then(data => {
        this.auth.callRefreshUserData(data.json());
        this._compiler.clearCache();
        this.uploadPicture = [];
      }).catch(err => {
        console.log(err);
      });
  }


  sendWaste() {
    if (this.newWaste && this.newWaste !== '') {
      const request = {
        user: this.auth.user.username,
        userId: this.auth.user._id,
        userType: this.typeWaste || 'public',
        content: this.newWaste
      };
      return this.data.sendWaste({request: request})
        .map(res => res.json())
        .subscribe(data => {
            this.newWaste = '';
            if (data && data.content && data.content.source === 'YouTube') {
              data.content._url = this._sanitizer.bypassSecurityTrustResourceUrl(data.content._url);
            }
            this.wasteComponent.wastes.unshift(data)
          },
          (err => console.log(err)));

    }
  }
}
