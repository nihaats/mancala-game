import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-how-to-play',
  templateUrl: './how-to-play.component.html',
  styleUrls: ['./how-to-play.component.css']
})
export class HowToPlayComponent implements OnInit {

  constructor(
    public modal: NgbModal
  ) { }

  ngOnInit(): void {
  }

}
