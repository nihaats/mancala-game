import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/services/main.service';

@Component({
  selector: 'app-first-player',
  templateUrl: './first-player.component.html',
  styleUrls: ['./first-player.component.css']
})
export class FirstPlayerComponent implements OnInit {

  store1IndexNumber: number = 6;
  store2IndexNumber: number = 13;
  defaultStoneCount: number = 4;

  constructor(
    public mainService: MainService
  ) { }

  ngOnInit(): void {
    this.createHoles();
  }

  createHoles(){
    for (let i = 0; i < this.store1IndexNumber; i++) {
      this.mainService.player1Holes.push([]);
    }
    this.distributeStones();
  }

  setColors(randomNumber: number){
    return this.mainService.colors[randomNumber];
  }

  distributeStones(){
    for (let i = 0; i < this.defaultStoneCount; i++) {
      this.mainService.player1Holes.forEach(x => {
        const randNumber = Math.floor(Math.random() * this.mainService.colors.length);
        x.push(this.setColors(randNumber))
      });
    }
  }

  player1Clicked(i: any,  count: number){
    const player1Holes = this.mainService.player1Holes;
    const player2Holes = this.mainService.player2Holes;

    //When 1 stone in the hole moves, it gives the hole index opposite the next hole.
    const oppositeIndex = 4 - i;
    //if there is only 1 stone in the hole
    if (count == 1) {
      if ((i+1) != this.store1IndexNumber) {
        //if the count of stones in the hole is not 0 and next hole is not store
        if(player1Holes[i+1].length != 0){
          let removedItem = player1Holes[i].shift();
          player1Holes[i+1].push(removedItem);
          this.mainService.player1 = false;
          this.mainService.player2 = true;
        }

        //if the count of stones in the hole is equal 0 and next hole is not store
        if(player1Holes[i+1].length == 0){
          //if the count of stones in the opposite hole is not 0
          if(player2Holes[oppositeIndex].length != 0){
            //We also throw the stones of the opposite hole into our own store.
            //when we move the last stone from the current hole to our next empty hole
            player2Holes[oppositeIndex].forEach((x: string) => {
              this.mainService.store1.push(x);
            });
            player2Holes[oppositeIndex]  = []
            this.mainService.store1.push(player1Holes[i].shift());

            this.mainService.finishGame();
            this.mainService.player1 = false;
            this.mainService.player2 = true;
            return;
          }
          //If there is no stone in the opposite hole, our own stone stays where it is and it is the opponent's turn.
          // when we move the last stone from the current hole to our next empty hole
          if(player2Holes[oppositeIndex].length == 0){
            player1Holes[i+1].push(player1Holes[i].shift());
            this.mainService.player1 = false;
            this.mainService.player2 = true;
            return;
          }
        }
      }

      //If the next nest is our store, we leave the last stone in our store and it's our turn again.
      if((i+1) == this.store1IndexNumber){
        let removedItem = player1Holes[i].shift();
        this.mainService.store1.push(removedItem);
        this.mainService.player1 = true;
        this.mainService.player2 = false;
        this.mainService.finishGame();
      }
    }
    //if there are more than 1 stones in the hole
    else {
      let itemsGroup: any = []
      player1Holes[i].forEach((x: string) => {
        itemsGroup.push(x);
      })
      player1Holes[i] = [];

      let end = (i+count)-1;
      let index2 = 0;
      let indexTest = 0
      let k = 0;
      let currentIndex = 0;
      for (let index = i ; index <= end ; index++) {
        if (index < this.store1IndexNumber){
          player1Holes[index].push(itemsGroup[index2]);
          if(index == end){
            this.mainService.player1 = false;
            this.mainService.player2 = true;
          }
        }

        if (index == this.store1IndexNumber){
          this.mainService.store1.push(itemsGroup[index2]);
          if(index == end){
            this.mainService.player1 = true;
            this.mainService.player2 = false;
          }
        }

        if (index > this.store1IndexNumber && index < this.store2IndexNumber) {
          this.mainService.player2Holes[indexTest].push(itemsGroup[index2]);

          if(index == end){
            let endLength = this.mainService.player2Holes[indexTest].length;
            currentIndex = end - 7;
            //If the number of stones in the slot where the last stone fell is even
            if( endLength % 2 == 0){
              this.mainService.player2Holes[currentIndex].forEach((x: string) => {
                this.mainService.store1.push(x);
              });
              this.mainService.player2Holes[currentIndex] = [];
              this.mainService.player1 = false;
              this.mainService.player2 = true;
            }
            if( endLength % 2 == 1){
              this.mainService.player1 = false;
              this.mainService.player2 = true;
            }
          }
          indexTest += 1;
        }

        if (index >= this.store2IndexNumber) {
          player1Holes[k].push(itemsGroup[index2]);
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
