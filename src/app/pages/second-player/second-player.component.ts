import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/services/main.service';

@Component({
  selector: 'app-second-player',
  templateUrl: './second-player.component.html',
  styleUrls: ['./second-player.component.css']
})
export class SecondPlayerComponent implements OnInit {

  store1IndexNumber: number = 13;
  store2IndexNumber: number = 6;
  defaultStoneCount: number = 4;

  constructor(
    public mainService: MainService
  ) {}

  ngOnInit(): void {
    this.defineHoleForPlayer1();
  }

  defineHoleForPlayer1(){
    for (let i = 0; i < this.store2IndexNumber; i++) {
      this.mainService.player2Holes.push([]);
    }
    this.taslariYuvalaraDagitma();
  }

  renkBelirleme(randomNumber: number){
    return this.mainService.colors[randomNumber];
  }

  taslariYuvalaraDagitma(){
    for (let i = 0; i < this.defaultStoneCount; i++) {
      this.mainService.player2Holes.forEach(x => {
        const randNumber = Math.floor(Math.random() * this.mainService.colors.length);
        x.push(this.renkBelirleme(randNumber))
      });
    }
  }

  player2Clicked(i: any,  count: number){
    const player1Holes = this.mainService.player1Holes;
    const player2Holes = this.mainService.player2Holes;

    //When 1 stone in the hole moves, it gives the hole index opposite the next hole.
    const oppositeIndex = 4 - i;
    //if there is only 1 stone in the hole
    if (count == 1) {
      if ((i+1) != this.store2IndexNumber) {
        //if the count of stones in the hole is not 0 and next hole is not store
        if(player2Holes[i+1].length != 0){
          let removedItem = player2Holes[i].shift();
          player2Holes[i+1].push(removedItem);
          this.mainService.player1 = true;
          this.mainService.player2 = false;
        }

        //if the count of stones in the hole is equal 0 and next hole is not store
        if(player2Holes[i+1].length == 0){
          //if the count of stones in the opposite hole is not 0
          if(player1Holes[oppositeIndex].length != 0){
            //We also throw the stones of the opposite hole into our own store.
            //when we move the last stone from the current hole to our next empty hole
            player1Holes[oppositeIndex].forEach((x: string) => {
              this.mainService.store2.push(x);
            });
            player1Holes[oppositeIndex]  = []

            let currentItem = player2Holes[i].shift();
            this.mainService.store2.push(currentItem);

            this.mainService.finishGame();
            this.mainService.player1 = true;
            this.mainService.player2 = false;
            return;
          }
          //If there is no stone in the opposite hole, our own stone stays where it is and it is the opponent's turn.
          // when we move the last stone from the current hole to our next empty hole
          if(player1Holes[oppositeIndex].length == 0){
            player2Holes[i+1].push(player2Holes[i].shift());
            this.mainService.player1 = true;
            this.mainService.player2 = false;
            return;
          }
        }
      }

      //If the next nest is our store, we leave the last stone in our store and it's our turn again.
      if((i+1) == this.store2IndexNumber){
        let removedItem = player2Holes[i].shift();
        this.mainService.store2.push(removedItem);
        this.mainService.player1 = false;
        this.mainService.player2 = true;
        this.mainService.finishGame();
      }
    }
    //if there are more than 1 stones in the hole
    else {
      let itemsGroup: any = []
      player2Holes[i].forEach((x: string) => {
        itemsGroup.push(x);
      })
      player2Holes[i] = [];

      let end = (i+count)-1;
      let index2 = 0;
      let indexTest = 0
      let k = 0;
      let currentIndex = 0;
      for (let index = i ; index <= end ; index++) {
        if (index < this.store2IndexNumber){
          player2Holes[index].push(itemsGroup[index2]);
          if(index == end){
            this.mainService.player1 = true;
            this.mainService.player2 = false;
          }
        }

        if (index == this.store2IndexNumber){
          this.mainService.store2.push(itemsGroup[index2]);
          if(index == end){
            this.mainService.player1 = false;
            this.mainService.player2 = true;
          }
        }

        if (index > this.store2IndexNumber && index < this.store1IndexNumber) {
          this.mainService.player1Holes[indexTest].push(itemsGroup[index2]);

          if(index == end){
            let endLength = this.mainService.player1Holes[indexTest].length;
            currentIndex = end - 7;
            //If the number of stones in the slot where the last stone fell is even
            if( endLength % 2 == 0){
              this.mainService.player1Holes[currentIndex].forEach((x: string) => {
                this.mainService.store2.push(x);
              });
              this.mainService.player1Holes[currentIndex] = [];
              this.mainService.player1 = true;
              this.mainService.player2 = false;
            }
            if( endLength % 2 == 1){
              this.mainService.player1 = true;
              this.mainService.player2 = false;
            }
          }
          indexTest += 1;
        }

        if (index >= this.store1IndexNumber) {
          player2Holes[k].push(itemsGroup[index2]);
          k += 1;
          if(index == end){
            this.mainService.player1 = false;
            this.mainService.player2 = true;
          }
        }

        index2 += 1;

      }
    }
  }
}
