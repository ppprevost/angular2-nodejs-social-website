import {Component, OnInit, Input} from '@angular/core';
import {DataService} from '../../services/data.service'

@Component({
  selector: 'app-waste',
  templateUrl: './waste.component.html',
  styleUrls: ['./waste.component.scss']
})
export class WasteComponent implements OnInit {

  @Input() numberOfWaste;
  @Input() typePost;
  @Input() onlyOwnPost;
  @Input() userId;
  private wastes;

  constructor(private data: DataService) { // en le mettant dans le constructeur toutes les methodes sont  disponibles
  }

  ngOnInit() {
    this.getPosts()
  }

  getPosts() {
    this.data.getPost(this.userId, this.numberOfWaste, this.typePost, this.onlyOwnPost)
      .map(res => res.json())
      .subscribe(
        data => {
          this.wastes = data
        },
        err => console.log(err))
  }
}
