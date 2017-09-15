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
import {InfiniteScrollService} from '../../services/infinite-scroll.service';
import {AuthService} from '../../services/auth.service';
import * as Masonry from 'masonry-layout';

@Component({
  selector: 'app-waste',
  templateUrl: './waste.component.html',
  styleUrls: ['./waste.component.scss'],
  providers: [InfiniteScrollService]
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
  private subComment;

  constructor(private _sanitizer: DomSanitizer, private infinite: InfiniteScrollService, private auth: AuthService, private socket: SocketService, private data: DataService) { // en le mettant dans le constructeur toutes les methodes sont  disponibles

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
      return this.masonry = new Masonry(item, {
        itemSelector: '.item'
      });
    }
  }

  ngOnDestroy() {

  }

  @HostListener('window:scroll', ['$event']) onScroll($event) {
    this.infinite.getInfiniteScroll(() => {
      this.data.getPost(this.userId, 10, 'all', false, this.wastes.length).map(res => res.json())
        .subscribe((data) => this.wastes = this.wastes.concat(data), err => console.log(err));
    });
  }

  ngOnChanges(changes) {
    console.log(changes);
    if (changes.userId && changes.userId.currentValue && changes.userId.currentValue !== changes.userId.previousValue) {
      this.getPosts();
    }
  }

  getPosts() {
    var self = this;
    this.data.getPost(this.userId, this.numberOfWaste, this.typePost, this.onlyOwnPost, this.wastes.length)
      .map(res => res.json())
      .subscribe(
        data => {
          this.wastes = data;
          this.wastes.forEach(waste => {
            if (waste && waste.content && waste.content.source === 'YouTube') {
              console.log('THIS', this);
              waste.content._url = self._sanitizer.bypassSecurityTrustResourceUrl(waste.content._url);
            }
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

  likeThisPostOrComment(wasteId, commentId?) {
    return this.data.likeThisPostOrComment(wasteId, commentId).map(res => res.json())
      .subscribe(data => {
        return this.wastes.map(elem => {
          if (elem._id === data._id) {
            if (!commentId) {
              elem.likes = data.likes.map(doc => {
                if (doc === this.auth.user._id) {
                  doc.likeItVeryMuch = true;
                }
                return doc;
              });
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
    wasters.map(waste => {
      if (waste._id === res.wasteId) {
        delete res.wasteId;
        delete res.userId;
        waste.commentary.push(res);
        waste.isOpeningCommentary = true;
        this.dataCommentaryWanted(waste, this.userId);
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
