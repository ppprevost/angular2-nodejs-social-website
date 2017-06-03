import {Component, OnInit, Input, OnDestroy, Injectable, OnChanges} from '@angular/core';
import {DataService} from '../../services/data.service';
import {SocketService} from "../../services/socket.service";
import {Waste} from "../../interface/interface";

@Component({
  selector: 'app-waste',
  templateUrl: './waste.component.html',
  styleUrls: ['./waste.component.scss']
})
@Injectable()
export class WasteComponent implements OnInit, OnDestroy, OnChanges {

  @Input() numberOfWaste: number;
  @Input() typePost;
  @Input() onlyOwnPost;
  isSwitchingComment;
  @Input() userId: string;
  wastes: [Waste];
  newComment: string;
  connection;

  constructor(private socket: SocketService, private data: DataService) { // en le mettant dans le constructeur toutes les methodes sont  disponibles

  }

  ngOnInit() {
    this.getPosts();
    this.connection = this.socket.socketFunction("getNewPost")
      .subscribe(message => {
        message.user = message.username;
        this.wastes.unshift(message);
      });
  }

  ngOnDestroy() {

  }

  ngOnChanges(changes) {
    console.log(changes);
    if (changes.userId.currentValue && changes.userId.currentValue != changes.userId.previousValue) {
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
            waste.isOpeningCommentary = false
          })
        },
        err => console.log(err))
  }

  dataCommentaryWanted(waste) {
    if (waste.isOpeningCommentary) {
      this.data.dataCommentary(waste)
        .map(res => res.json())
        .subscribe(res => {
          return this.wastes.map(elem => {
            if (elem._id == res._id) {
              elem = res
            }
            return elem
          })
        })
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
        this.wastes.map(waste => {
          if (waste._id == res.wasteId) {
            delete res.wasteId;
            delete res.userId;
            waste.commentary.push(res)
          }
          return waste
        })
      })
  }
}
