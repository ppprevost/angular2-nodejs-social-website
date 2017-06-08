import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  Injectable,
  OnChanges,
  AfterViewChecked,
  ViewChild,
  HostListener
} from '@angular/core';
import {DataService} from '../../services/data.service';
import {SocketService} from "../../services/socket.service";
import {Waste} from "../../interface/interface";
import {AuthService} from '../../services/auth.service';
import * as Masonry from 'masonry-layout';

@Component({
  selector: 'app-waste',
  templateUrl: './waste.component.html',
  styleUrls: ['./waste.component.scss']
})
@Injectable()
export class WasteComponent implements OnInit, AfterViewChecked, OnDestroy, OnChanges {

  @ViewChild('wasteMasonry') wasteCompo;
  @Input() numberOfWaste: number;
  @Input() typePost;
  @Input() onlyOwnPost;
  @Input() userId: string;
  wastes: Array<Waste>;
  connection;
  private subComment;

  constructor(private auth: AuthService, private socket: SocketService, private data: DataService) { // en le mettant dans le constructeur toutes les methodes sont  disponibles

  }


  ngOnInit() {
    this.connection = this.socket.socketFunction("getNewPost")
      .subscribe(message => {
        message.user = message.username;
        this.wastes.unshift(message);
      });
    this.subComment = this.socket.socketFunction("newComments")
      .subscribe(message => {
        this.getBackPosts(this.wastes, message);
      });
  }

  ngAfterViewChecked() {
    if (this.wasteCompo) {
      const item = this.wasteCompo.nativeElement;
      return new Masonry(item, {
        itemSelector: '.item'
      });
    }
  }

  ngOnDestroy() {

  }

  @HostListener('window:scroll', ['$event']) onScroll($event) {
    function getDocHeight() {
      var D = document;
      return Math.max(
        D.body.scrollHeight, D.documentElement.scrollHeight,
        D.body.offsetHeight, D.documentElement.offsetHeight,
        D.body.clientHeight, D.documentElement.clientHeight
      );
    }

    function getScrollXY() {
      var scrOfX = 0, scrOfY = 0;
      if (typeof( window.pageYOffset ) == 'number') {
        //Netscape compliant
        scrOfY = window.pageYOffset;
        scrOfX = window.pageXOffset;
      } else if (document.body && ( document.body.scrollLeft || document.body.scrollTop )) {
        //DOM compliant
        scrOfY = document.body.scrollTop;
        scrOfX = document.body.scrollLeft;
      } else if (document.documentElement && ( document.documentElement.scrollLeft || document.documentElement.scrollTop )) {
        //IE6 standards compliant mode
        scrOfY = document.documentElement.scrollTop;
        scrOfX = document.documentElement.scrollLeft;
      }
      return [scrOfX, scrOfY];
    }

    function debounce(func, wait, immediate, context?) {
      var result;
      var timeout = null;
      return function() {
        var ctx = context || this, args = arguments;
        var later = function() {
          timeout = null;
          if (!immediate) result = func.apply(ctx, args);
        };
        var callNow = immediate && !timeout;
        // Tant que la fonction est appelée, on reset le timeout.
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) result = func.apply(ctx, args);
        return result;
      };
    }
    if (getDocHeight() - 20 <= getScrollXY()[1] + window.innerHeight) {
      debounce((d) => console.log(d), 250,false);
      console.log('edeors debounce');
    }
  }


  ngOnChanges(changes) {
    console.log(changes);
    if (changes.userId && changes.userId.currentValue && changes.userId.currentValue != changes.userId.previousValue) {
      this.getPosts();
    }
  }

  getPosts() {
    this.data.getPost(this.userId, this.numberOfWaste, this.typePost, this.onlyOwnPost)
      .map(res => res.json())
      .subscribe(
        data => {
          this.wastes = data;
          this.wastes.forEach(waste => {
            waste.isOpeningCommentary = false;
          });
        },
        err => console.log(err));
  }

  dataCommentaryWanted(waste: Waste, userId: string) {
    if (waste.isOpeningCommentary) {
      this.data.dataCommentary(waste, userId)
        .map(res => res.json())
        .subscribe(res => {
          return this.wastes = this.wastes.map(elem => {
            if (elem._id == res._id) {
              elem = res as Waste;
            }
            return elem;
          });
        });
    }
  }

  sendWasteComments(wasteId, value) {
    let comments = {
      wasteId: wasteId,
      userId: this.userId,
      typeWaste: "text",
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
      if (waste._id == res.wasteId) {
        delete res.wasteId;
        delete res.userId;
        waste.commentary.push(res);
        waste.isOpeningCommentary = true;
        this.dataCommentaryWanted(waste, this.userId);
      }
      return waste;
    });
  }

}
