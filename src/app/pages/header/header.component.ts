import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { HowToPlayComponent } from '../how-to-play/how-to-play.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(
    private ngbModal: NgbModal,
  ) { }

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
