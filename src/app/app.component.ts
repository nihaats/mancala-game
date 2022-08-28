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

  itemsGroup: any[] = [
    [], //items0
    [], //items1
    [], //items2
    [], //items3
    [], //items4
    [], //items5
    [], //mancala1
    [], //items7
    [], //items8
    [], //items9
    [], //items10
    [], //items11
    [], //items12
    [], //mancala2
  ]

  colors: any[] = [
    '#E53535',
    '#D71AD0',
    '#1985F0',
    '#19F04C',
    '#F8FF2F',
  ]

  player1: boolean = true;
  player2: boolean = false;
  isShowAlert: boolean = true;

  constructor(
    private ngbModal: NgbModal
  ){}

  ngOnInit(): void {
    setTimeout(() => {
      this.isShowAlert = false;
    }, 2000);

    this.markers();
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
        return;
    })
  }

  howToPlay(){
    this.ngbModal.open(HowToPlayComponent, {size: 'xl'})
  }

  finishGame(playerNumber: number){
    //oyun bitiş kontrolü
    let stoneCount: number = 0;
    //yuvalardaki toplam taş sayısı kontrolü
    for (let index = (playerNumber == 1 ? 0 : 7); index < (playerNumber == 1 ? 6 : 13); index++) {
      stoneCount += this.itemsGroup[index].length;
    }
    if(stoneCount == 0){
      for (let index = (playerNumber == 2 ? 0 : 7); index < (playerNumber == 2 ? 6 : 13); index++) {
        this.itemsGroup[index].forEach((x: any) => {
          this.itemsGroup[playerNumber == 2 ? 13 : 6].push(x);
          this.itemsGroup[index] = [];
        })
      }

      let i6length = this.itemsGroup[6].length;
      let i13length = this.itemsGroup[13].length;
      let winner = i6length == i13length ? 'Player1 & Player2' : (i6length > i13length ? 'Player1' : 'Player2')

      Swal.fire({
        title: "Game Over!",
        text: "Winner player is " + winner,
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
        allowOutsideClick: false,
      })
      return;
    }
  }

  markerColor(randomNumber: number){
    return this.colors[randomNumber];
  }

  markers(){
    for (let i = 0; i < 13; i++) {
      if(i == 6)
        i++;
      for (let k = 0; k < 4; k++) {
        let randNumber = Math.floor(Math.random() * 5);
        this.itemsGroup[i].push(this.markerColor(randNumber))

      }
    }
  }

  playerClicked(i: any,  count: number){
    //Player1 clicked
    if(i < 6){
      //When 1 stone in the hole moves, it gives the hole index opposite the next hole.
      let oppositeIndex = (i == 0 ? 11 : (i == 1 ? 10 : (i == 2 ? 9 : (i == 3 ? 8 : (i == 4 ? 7 : 0)))))
      //if there is only 1 stone in the hole
      if (count == 1) {
        //if the count of stones in the hole is not 0 and next hole is not store
        if(this.itemsGroup[i+1].length != 0 && (i+1) != 6){
          let removedItem = this.itemsGroup[i].shift();
          this.itemsGroup[i+1].push(removedItem);
          this.player1 = false;
          this.player2 = true;
          return;
        }
        //if the count of stones in the hole is equal 0 and next hole is not store
        if(this.itemsGroup[i+1].length == 0 && (i+1) != 6){
          //if the count of stones in the opposite hole is not 0
          if(this.itemsGroup[oppositeIndex].length != 0){
            //We also throw the stones of the opposite hole into our own store.
            //when we move the last stone from the current hole to our next empty hole
            this.itemsGroup[oppositeIndex].forEach((x: any) => {
              this.itemsGroup[6].push(x);
            });
            this.itemsGroup[oppositeIndex]  = []

            let currentItem = this.itemsGroup[i].shift();
            this.itemsGroup[6].push(currentItem);

            this.finishGame(1);
            this.player1 = false;
            this.player2 = true;
            return;
          }
          //If there is no stone in the opposite hole, our own stone stays where it is and it is the opponent's turn.
          // when we move the last stone from the current hole to our next empty hole
          if(this.itemsGroup[oppositeIndex].length == 0){

            let removedItem = this.itemsGroup[i].shift();
            this.itemsGroup[i+1].push(removedItem);

            this.player1 = false;
            this.player2 = true;
            return;
          }
        }

        //If the next nest is our store, we leave the last stone in our store and it's our turn again.
        if((i+1) == 6){
          let removedItem = this.itemsGroup[i].shift();
          this.itemsGroup[6].push(removedItem);

          this.player1 = true;
          this.player2 = false;
          this.finishGame(1);
          return;
        }

      }
      //if there are more than 1 stones in the hole
      else {
        let firstItem = this.itemsGroup[i].splice(0, 1);
        let itemsGroup: any = []
        this.itemsGroup[i].forEach((x: any) => {
          itemsGroup.push(x);
        })
        this.itemsGroup[i] = [];
        this.itemsGroup[i].push(firstItem);

        let end = (i+count)-1;
        let isFirstEntry = true;
        let index2 = 0;
        for (let index = i+1 ; index <= end ; index++) {
          if(index > 12 && isFirstEntry){
            end = (end % 12) - 1;
            index = 0;
            isFirstEntry = false;
          }
          if(index == 13){
            index++;
          }

          this.itemsGroup[index].push(itemsGroup[index2]);
          index2++;

        }
        //if the last stone is in the our hole
        if(end == 6){
          this.player1 = true;
          this.player2 = false;
        }
        //if the last stone is in the opposite hole
        else if(end > 6){
          let endLength = this.itemsGroup[end].length;
          //If the number of stones in the slot where the last stone fell is even
          if( endLength % 2 == 0){
            this.itemsGroup[end].forEach((x: any) => {
              this.itemsGroup[6].push(x);
            });
            this.itemsGroup[end] = [];
            this.player1 = false;
            this.player2 = true;
            return;
          }
          //If the number of stones in the slot where the last stone fell is odd
          if( endLength % 2 == 1){
            this.player1 = false;
            this.player2 = true;
            return;
          }
        }
        //if the nest where the last stone will fall is one of our own
        else{
          this.player1 = false;
          this.player2 = true;
        }
      }
    }

    //Player2 clicked
    if(i>6){
      //When 1 stone in the hole moves, it gives the hole index opposite the next hole.
      let oppositeIndex = (i == 7 ? 4 : (i == 8 ? 3 : (i == 9 ? 2 : (i == 10 ? 1 : (i == 11 ? 0 : 0)))))
      //if there is only 1 stone in the hole
      if (count == 1) {
        //if the count of stones in the hole is not 0 and next hole is not store
        if(this.itemsGroup[i+1].length != 0 && (i+1) != 13){
          let removedItem = this.itemsGroup[i].shift();
          this.itemsGroup[i+1].push(removedItem);

          this.player1 = true;
          this.player2 = false;
          return;
        }
        //if the count of stones in the hole is equal 0 and next hole is not store
        if(this.itemsGroup[i+1].length == 0 && (i+1) != 13){
          //if the count of stones in the opposite hole is not 0
          if(this.itemsGroup[oppositeIndex].length != 0){
            //We also throw the stones of the opposite hole into our own store.
            //when we move the last stone from the current hole to our next empty hole
            this.itemsGroup[oppositeIndex].forEach((x: any) => {
              this.itemsGroup[13].push(x);
            });
            this.itemsGroup[oppositeIndex] = [];

            let currentItem = this.itemsGroup[i].shift();
            this.itemsGroup[13].push(currentItem);

            this.finishGame(2);
            this.player1 = true;
            this.player2 = false;
            return;
          }
          //If there is no stone in the opposite hole, our own stone stays where it is and it is the opponent's turn.
          // when we move the last stone from the current hole to our next empty hole
          if(this.itemsGroup[oppositeIndex].length == 0){
            let removedItem = this.itemsGroup[i].shift();
            this.itemsGroup[i+1].push(removedItem);


            this.player1 = true;
            this.player2 = false;
            return;
          }
        }

        //If the next nest is our store, we leave the last stone in our store and it's our turn again.
        if((i+1) == 13){
          let removedItem = this.itemsGroup[i].shift();
          this.itemsGroup[13].push(removedItem);


          this.player1 = false;
          this.player2 = true;
          this.finishGame(2);
          return;
        }

      }
      //if there are more than 1 stones in the hole
      else {
        let firstItem = this.itemsGroup[i].splice(0, 1);
        let itemsGroup: any = []
        this.itemsGroup[i].forEach((x: any) => {
          itemsGroup.push(x);
        })
        this.itemsGroup[i] = [];
        this.itemsGroup[i].push(firstItem);


        const constantEnd = (i+count)-1;
        let end = (i+count)-1;
        let isFirstEntry = true;
        let index2 = 0;

        for (let index = i+1 ; index <= end ; index++) {
          if(index > 13 && isFirstEntry){
            end = (end % 13) - 1;
            if (end == 6) {
              end = (constantEnd % 13);
            }
            index = 0;
            isFirstEntry = false;
          }
          if(index == 6){
            index++;
          }

          this.itemsGroup[index].push(itemsGroup[index2]);
          index2++;
        }
        //if the last stone is in the our hole
        if(end == 13){
          this.player1 = false;
          this.player2 = true;
        }
        //if the last stone is in the opposite hole
        else if(end < 6){
          let endLength = this.itemsGroup[end].length;
          //If the number of stones in the slot where the last stone fell is even
          if( endLength % 2 == 0){
            this.itemsGroup[end].forEach((x: any) => {
              this.itemsGroup[13].push(x);
            });
            this.itemsGroup[end] = [];
            this.player1 = true;
            this.player2 = false;
            return;
          }
          //If the number of stones in the slot where the last stone fell is odd
          if( endLength % 2 == 1){
            this.player1 = true;
            this.player2 = false;
            return;
          }
        }
        //if the nest where the last stone will fall is one of our own
        else{
          this.player1 = true;
          this.player2 = false;
        }
      }

    }


  }

}


