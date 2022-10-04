import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { HowToPlayComponent } from './pages/how-to-play/how-to-play.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isShowAlert: boolean = true;

  constructor(
    private ngbModal: NgbModal,
  ){}

  ngOnInit(): void {
  }

  reset(){
    Swal.fire({
      title: 'Do you want to reset the game?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      customClass: { title: 'swal-style' },
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.reload();
      }
      else
        Swal.close();
    })
  }

  howToPlay(){
    this.ngbModal.open(HowToPlayComponent, {size: 'xl'})
  }

}


