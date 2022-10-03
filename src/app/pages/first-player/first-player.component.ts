import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-first-player',
  templateUrl: './first-player.component.html',
  styleUrls: ['./first-player.component.css']
})
export class FirstPlayerComponent implements OnInit {

  store1Index: number = 0;
  store2Index: number = 1;
  defaultStoneCount: number = 4;
  defaultHoleCount: number = 12;
  initalValue: number = 5;
  holes: any[] = [];
  stores: any[] = [];
  isPlayer1: boolean = true;
  isPlayer2: boolean = false;
  oppositeIndex: number = 0;

  //* begin:: Inital Settings
  ngOnInit(): void {
    this.createHoles();
    this.createStores();
  }

  createHoles(){
    for (let i = 0; i < this.defaultHoleCount; i++) {
      this.holes.push([]);
    }
    this.distributeStones();
  }

  createStores(){
    for (let i = 0; i < 2; i++) {
      this.stores.push([]);
    }
  }

  distributeStones(){
    for (let i = 0; i < this.defaultStoneCount; i++) {
      this.holes.forEach(x => {
        const randNumber = Math.floor(Math.random() * this.colors.length);
        x.push(this.setColors(randNumber))
      });
    }
  }

  colors: string[] = [
    '#E53535', //Kırmızı
    '#D71AD0', //Pembe
    '#1985F0', //Mavi
    '#19F04C', //Yeşil
    '#F8FF2F',  //Sarı
    '#52012a', //Bordo
    '#7cb9ef', //Mavi
    // '#000'
  ]

  setColors(randomNumber: number){
    return this.colors[randomNumber];
  }

  turn(isPlayer1: boolean = false, isPlayer2: boolean = false){
    this.isPlayer1 = isPlayer1;
    this.isPlayer2 = isPlayer2;
    console.log("player1: " + this.isPlayer1);
    console.log("player2: " + this.isPlayer2);
  }
  //* end:: Inital Settings

  playerClicked(mainIndex: number, currentIndex: number, count: number){
    this.oppositeIndex = mainIndex < 6 ? (10 - currentIndex) : (currentIndex - 5)
    switch (currentIndex + count) {
      //* 1) #FirstAction taş sayısı 1 ise ve bir sonraki yuva, store1 ise
      case 6:
        this.stoneCountIsOneAndNextIndexIsStore(mainIndex, currentIndex, count);
        break;

      //* 2) #SecondAction taş sayısı 1'den fazla ise ve son yuva, store1 ise
      case 7:
        this.stoneCountIsMoreThanOneAndNextIndexIsStore(mainIndex, currentIndex, count);
        break;

      //* 3) #ThirdAction taş sayısı 1 ise ve bir sonraki yuva, store2 ise
      case 12:
        this.stoneCountIsOneAndNextIndexIsStore(mainIndex, currentIndex, count);
        break;

      //* 4) #FourthAction taş sayısı 1'den fazla ise ve son yuva, store2 ise
      case 13:
        this.stoneCountIsMoreThanOneAndNextIndexIsStore(mainIndex, currentIndex, count);
        break;

      //* 5) #DefaultAction taş sayısı 1'den fazla ise ve son yuva, store2 ise
      default:
        this.generalClicked(mainIndex, currentIndex, count)
        break;
    }
  }

  stoneCountIsOneAndNextIndexIsStore(mainIndex: number, currentIndex: number, count: number){
    if(count == 1)
      this.pushOneToStore(mainIndex);
    else
      this.generalClicked(mainIndex, currentIndex, count);
  }

  stoneCountIsMoreThanOneAndNextIndexIsStore(mainIndex: number, currentIndex: number, count: number){
    if(count > 1 && count < 8)
      this.pushMoreThanOneToStore(mainIndex);
    else
      this.generalClicked(mainIndex, currentIndex, count);
  }

  generalClicked(mainIndex: number, currentIndex: number, count: number){
    if(count == 1) {
      const nextHoleIndex: number = mainIndex < 6 ? (mainIndex - 1) : (currentIndex + 1);

      if(this.holes[nextHoleIndex].length == 0 && this.holes[this.oppositeIndex].length == 0){
        this.nextIndexEqual0AndOppositeIndexEqual0(nextHoleIndex, mainIndex);
        return;
      }
      if(this.holes[nextHoleIndex].length == 0 && this.holes[this.oppositeIndex].length != 0){
        this.nextIndexEqual0AndOppositeIndexNotEqual0(nextHoleIndex, mainIndex)
        return;
      }
      if(this.holes[nextHoleIndex].length != 0){
        this.nextIndexNotEqual0(nextHoleIndex, mainIndex)
        return;
      }
    }
    if(count > 1){
      // this.stoneCountsMoreThanOne(mainIndex, currentIndex, count);
      if((currentIndex + count >= 0 && currentIndex + count <= 6) || (currentIndex + count > 7 && currentIndex + count <= 13)){
        this.stoneCountIsMoreThanOneAndNextIndexIsNotStore(mainIndex, currentIndex, count)
      }
      if(currentIndex + count > 13){
        this.stoneCountIsMoreThanOneAndNextIndexIsNotStore(mainIndex, currentIndex, count);
      }

    }
  }

  pushOneToStore(i: any){
    const storeIndex = i < 6 ? this.store1Index : this.store2Index
    this.stores[storeIndex].push(this.holes[i].shift());
    storeIndex == this.store1Index ? this.turn(true) : this.turn(false, true)
  }

  pushMoreThanOneToStore(mainIndex: number){
    const lastStone: string = this.holes[mainIndex].splice(-1);
    const newHoles = JSON.parse(JSON.stringify(this.holes));
    this.holes[mainIndex] = []
    for (let i = 0; i < newHoles[mainIndex].length; i++) {
      this.holes[mainIndex < 6 ? mainIndex - i : mainIndex + i].push(newHoles[mainIndex][i]);
    }
    this.stores[mainIndex < 6 ? this.store1Index : this.store2Index].push(lastStone);
    mainIndex < 6 ? this.turn(true) : this.turn(false, true);
  }

  //* begin:: #DefaultAction - taş sayısı 1 ise
  nextIndexEqual0AndOppositeIndexEqual0(nextHoleIndex: number, mainIndex: number){
    this.holes[nextHoleIndex].push(this.holes[mainIndex].shift());
    mainIndex < 6 ? this.turn(false, true) : this.turn(true);
  }

  nextIndexEqual0AndOppositeIndexNotEqual0(nextHoleIndex: number, mainIndex: number){
    const storeIndex: number = mainIndex < 6 ? this.store1Index : this.store2Index;
    this.stores[storeIndex].push(this.holes[mainIndex].shift());
    this.holes[this.oppositeIndex].forEach((x: string) => {
      this.stores[storeIndex].push(x);
    });
    this.holes[this.oppositeIndex] = [];
    mainIndex < 6 ? this.turn(false, true) : this.turn(true);
  }

  nextIndexNotEqual0(nextHoleIndex: number, mainIndex: number){
    this.holes[nextHoleIndex].push(this.holes[mainIndex].shift());
    mainIndex < 6 ? this.turn(false, true) : this.turn(true);
  }
  //* end:: #DefaultAction - taş sayısı 1 ise

  // begin:: #DefaultAction - taş sayısı 1'den fazla ise
  // stoneCountsMoreThanOne(mainIndex: number, currentIndex: number, count: number){
  //   if((currentIndex + count >= 0 && currentIndex + count <= 6) || (currentIndex + count > 7 && currentIndex + count <= 13)){
  //     this.stoneCountIsMoreThanOneAndNextIndexIsNotStore(mainIndex, currentIndex, count)
  //   }
  //   if(currentIndex + count > 13){
  //     this.stoneCountIsMoreThanOneAndNextIndexIsNotStore(mainIndex, currentIndex, count);
  //   }
  // }

  stoneCountIsMoreThanOneAndNextIndexIsNotStore(mainIndex: number, currentIndex: number, count: number){
    const newHoles = JSON.parse(JSON.stringify(this.holes));
    this.holes[mainIndex] = [];
    let k = 0;

    // current = 5
    // count = 9

    for (let i = 0; i < newHoles[mainIndex].length; i++) {
      if(currentIndex < 6){

        if(currentIndex + 1 + i < 7){
          this.holes[mainIndex - i].push(newHoles[mainIndex][i]);
        }

        if(currentIndex + 1 + i == 7){
          this.stores[this.store1Index].push(newHoles[mainIndex][i]);
        }

        if(currentIndex + 1 + i > 7){
          this.holes[(currentIndex - 1) + i].push(newHoles[mainIndex][i]);
        }

      }
      else{

        if (currentIndex + i < 12) {
          this.holes[currentIndex + i].push(newHoles[mainIndex][i]);
        }

        if (currentIndex + i == 12) {
          this.stores[this.store2Index].push(newHoles[mainIndex][i]);
        }

        if (currentIndex + i > 12) {
          this.holes[this.initalValue - k].push(newHoles[mainIndex][i]);
          k = k + 1;
        }

      }
    }
    mainIndex < 6 ? this.turn(false, true) : this.turn(true);
  }
  // end:: #DefaultAction - taş sayısı 1'den fazla ise
}
