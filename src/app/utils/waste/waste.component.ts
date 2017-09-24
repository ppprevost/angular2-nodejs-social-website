import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  OnChanges,
  AfterViewChecked,
  ViewChild,
  HostListener
} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {DataService} from '../../services/data.service';
import {SocketService} from '../../services/socket.service';
import {Waste, Commentary} from '../../interface/interface';
import {InfiniteScrollerDirective} from '../infinite-scroller.directive';
import {AuthService} from '../../services/auth.service';
import * as Masonry from 'masonry-layout';
import 'rxjs/add/operator/concatMap';
import {Observable} from 'rxjs';


@Component({
  selector: 'app-waste',
  templateUrl: './waste.component.html',
  styleUrls: ['./waste.component.scss'],
  providers: [InfiniteScrollerDirective]
})

export class WasteComponent implements OnInit, AfterViewChecked, OnDestroy, OnChanges {

  @ViewChild('wasteMasonry') wasteCompo;
  @Input() numberOfWaste: number;
  @Input() typePost;
  @Input() onlyOwnPost;
  @Input() userId: string;
  masonry;
  wastes: Array<Waste> = [];
  connection;
  scrollCallback;
  private subComment;

  constructor(private _sanitizer: DomSanitizer, private auth: AuthService, private socket: SocketService, private data: DataService) { // en le mettant dans le constructeur toutes les methodes sont  disponibles


  }

  ngOnInit() {
    this.connection = this.socket.socketFunction('getNewPost')
      .subscribe(message => {
        message.user = message.username;
        this.wastes.unshift(message);
      });
    this.subComment = this.socket.socketFunction('newComments')
      .subscribe(message => {
        this.getBackPosts(this.wastes, message);
      });
  }

  ngAfterViewChecked() {

    if (this.wasteCompo) {
      const item = this.wasteCompo.nativeElement;
      // TODO make masonry better
      // return this.masonry = new Masonry(item, {
      //   itemSelector: '.item'
      // });
    }

  }

  ngOnDestroy() {

  }

  onScrollDown() {
    console.log('scrolled down!!');
    this.data.getPost(this.userId, 10, 'all', false, this.wastes.length)
      .map(res => res.json())
      .subscribe((data) => {
          data = data.map(elem => {
            this.videoByPassSecurity(elem);
            return elem
          });
          this.wastes = this.wastes.concat(data) as Waste[], err => console.log(err)
        }
      )
    ;
  }

  onScrollUp() {
    console.log('scrolled up!!')
  }

  ngOnChanges(changes) {
    console.log(changes);
    if (changes.userId && changes.userId.currentValue && changes.userId.currentValue !== changes.userId.previousValue) {
      this.getPosts();
    }
  }

  private videoByPassSecurity = function (waste) {
    if (waste && waste.content && waste.content.source === 'YouTube') {
      waste.content._url = this._sanitizer.bypassSecurityTrustResourceUrl(waste.content._url);
    }
  }

  getPosts() {
    this.data.getPost(this.userId, this.numberOfWaste, this.typePost, this.onlyOwnPost, this.wastes.length)
      .map(res => res.json())
      .subscribe(
        data => {
          this.wastes = data;
          this.wastes.forEach(waste => {
            this.likeComment(waste);
            this.videoByPassSecurity(waste);
            waste.isOpeningCommentary = false;
          });
        },
        err => console.log(err));
  }

  private dataCommentaryWanted(waste: Waste, userId: string) {
    if (waste.isOpeningCommentary) {
      this.data.dataCommentary(waste, userId)
        .map(res => res.json())
        .subscribe(res => {
          return this.wastes = this.wastes.map(elem => {
            if (elem._id === res._id) {
              elem.commentary = res.commentary;
            }
            return elem;
          });
        });
    }
  }

  /**
   * Update number of like of a post
   * @param {Waste} elem -exisiting waste already published
   * @param {Waste} data -new one
   */
  likeComment(elem: Waste, data?: Waste) {
    var contentLike = function (doc) {
      return {
        youOnly: 'You like this',
        youAndOther: 'You and ' + (doc.length - 1) + ' people like this',
        otherOnly: doc.length + ' people like' + (doc.length > 1 ? 's' : '')
      }
    };
    data = data ? data : elem; // for init no need to update
    if (data.likes.length) {
      elem.youLikeThis = false;
      data.likes.forEach(doc => {
        elem.persoLikeSentence = {content: contentLike(data.likes).otherOnly, userIds: data.likes};
        if (doc === this.auth.user._id) {
          elem.youLikeThis = !elem.youLikeThis;
          if (data.likes.length === 1 && elem.youLikeThis) {
            elem.persoLikeSentence.content = contentLike(data.likes).youOnly;
          } else {
            if (elem.youLikeThis) {
              elem.persoLikeSentence.content = contentLike(data.likes).youAndOther;
            }
          }
        }
      });
    }
  }

  /**
   * Like or Unlike the post
   * @param wasteId
   * @param commentId
   * @returns {Subscription}
   */
  likeThisPostOrComment(wasteId, commentId?) {
    return this.data.likeThisPostOrComment(this.auth.user._id, wasteId, commentId).map(res => res.json())
      .subscribe(data => {
        return this.wastes.map(elem => {
          if (elem._id === data._id) {
            elem.likes = data.likes;
            if (!commentId) {
              this.likeComment(elem, data)
            } else {
              this.wastes[this.wastes.indexOf(elem)].likes = this.wastes[this.wastes.indexOf(data)].likes;
            }
            return elem;
          }
        });
      });
  }

  /**
   * Send a comment
   * @param wasteId
   * @param value
   * @returns {Subscription}
   */
  sendWasteComments(wasteId, value) {
    const comments = {
      wasteId: wasteId,
      userId: this.userId,
      typeWaste: 'text',
      data: value.value,
    };
    return this.data.sendWasteComments(comments)
      .map(res => res.json())
      .subscribe(res => {
        this.getBackPosts(this.wastes, res);
      });
  }

  getBackPosts(wasters, res) {
    wasters.forEach(waste => {
      if (waste._id === res.wasteId) {
        delete res.wasteId;
        delete res.userId;
        waste.commentary.push(res);
        waste.isOpeningCommentary = true;
        // this.dataCommentaryWanted(waste, this.userId);
      }
      return waste;
    });
  }

  /**
   *
   * @param wasteId
   * @param wasteOrComment
   * @returns {Subscription}
   */
  deleteWasteOrPost(wasteId, wasteOrComment?) {
    return this.data.deletePost(wasteId, wasteOrComment)
      .map(res => res.json())
      .subscribe(data => {
        return this.wastes.map(elem => {
          if (elem._id === data._id) {
            if (wasteOrComment) {
              elem.commentary = data.commentary;
            } else {
              this.wastes.splice(this.wastes.indexOf(elem), 1);
            }
            return elem;
          }
        });
      }, err => console.log(err));
  }
}
