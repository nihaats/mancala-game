import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
})
export class BoardComponent implements OnInit {
  store1Index: number = 0;
  store2Index: number = 1;
  defaultStoneCount: number = 4;
  defaultHoleCount: number = 12;
  player1LastIndexValue: number = 5;
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

  createHoles() {
    for (let i = 0; i < this.defaultHoleCount; i++) {
      this.holes.push([]);
    }
    this.distributeStones();
  }

  createStores() {
    for (let i = 0; i < 2; i++) {
      this.stores.push([]);
    }
  }

  distributeStones() {
    for (let i = 0; i < this.defaultStoneCount; i++) {
      this.holes.forEach((x) => {
        const randNumber = Math.floor(Math.random() * this.colors.length);
        x.push(this.setColors(randNumber));
      });
    }
  }

  colors: string[] = [
    '#E53535', //Kırmızı
    '#D71AD0', //Pembe
    '#1985F0', //Mavi
    '#19F04C', //Yeşil
    '#F8FF2F', //Sarı
    '#52012a', //Bordo
    '#7cb9ef', //Mavi
    '#000',
  ];

  setColors(randomNumber: number) {
    return this.colors[randomNumber];
  }

  turn(mainIndex: number, isPlayer1: boolean = true) {
    if (mainIndex > 5) {
      this.isPlayer1 = isPlayer1;
      this.isPlayer2 = !isPlayer1;
    } else {
      this.isPlayer1 = !isPlayer1;
      this.isPlayer2 = isPlayer1;
    }
  }

  finishCheck(currentIndex: number) {
    let total: number = 0;
    let initalValue = currentIndex < 6 ? 0 : 6;
    let finishValue = currentIndex < 6 ? 5 : 11;

    let oppositeInitialValue = currentIndex < 6 ? 6 : 0;
    let oppositeFinishValue = currentIndex < 6 ? 11 : 5;

    let currentStore =
      currentIndex < 6
        ? this.stores[this.store1Index]
        : this.stores[this.store2Index];

    for (let i = initalValue; i <= finishValue; i++) {
      total += this.holes[i].length;
    }
    if (total == 0) {
      for (let i = oppositeInitialValue; i <= oppositeFinishValue; i++) {
        this.holes[i].forEach((x: string) => {
          currentStore.push(x);
        });
        this.holes[i] = [];
      }
    } else return;

    let winner =
      this.stores[this.store1Index].length >
      this.stores[this.store2Index].length
        ? 'Kazanan Player1'
        : 'Kazanan Player2';

    Swal.fire({
      title: 'Game Over!',
      text: winner,
      // text: "Winner player is " + winner,
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
      allowOutsideClick: false,
    });
    return;
  }

  //* end:: Inital Settings

  playerClicked(mainIndex: number, currentIndex: number, count: number) {
    this.oppositeIndex = mainIndex < 6 ? 10 - currentIndex : currentIndex - 5;
    switch (currentIndex + count) {
      //* 1) #FirstAction taş sayısı 1 ise ve bir sonraki yuva, store1 ise
      case 6:
        this.stoneCountIsOneAndNextIndexIsStore(mainIndex, currentIndex, count);
        break;

      //* 2) #SecondAction taş sayısı 1'den fazla ise ve son yuva, store1 ise
      case 7:
        this.stoneCountIsMoreThanOneAndNextIndexIsStore(
          mainIndex,
          currentIndex,
          count
        );
        break;

      //* 3) #ThirdAction taş sayısı 1 ise ve bir sonraki yuva, store2 ise
      case 12:
        this.stoneCountIsOneAndNextIndexIsStore(mainIndex, currentIndex, count);
        break;

      //* 4) #FourthAction taş sayısı 1'den fazla ise ve son yuva, store2 ise
      case 13:
        this.stoneCountIsMoreThanOneAndNextIndexIsStore(
          mainIndex,
          currentIndex,
          count
        );
        break;

      //* 5) #DefaultAction taş sayısı 1'den fazla ise ve son yuva, store2 ise
      default:
        this.defaultAction(mainIndex, currentIndex, count);
        break;
    }
  }

  stoneCountIsOneAndNextIndexIsStore(
    mainIndex: number,
    currentIndex: number,
    count: number
  ) {
    if (count == 1) {
      const storeIndex = mainIndex < 6 ? this.store1Index : this.store2Index;
      this.stores[storeIndex].push(this.holes[mainIndex].shift());
      this.turn(mainIndex, false);
      this.finishCheck(mainIndex);
    } else this.defaultAction(mainIndex, currentIndex, count);
  }

  stoneCountIsMoreThanOneAndNextIndexIsStore(
    mainIndex: number,
    currentIndex: number,
    count: number
  ) {
    if (count > 1 && count < 8) {
      const lastStone: string = this.holes[mainIndex].splice(-1);
      const newHoles = JSON.parse(JSON.stringify(this.holes));
      this.holes[mainIndex] = [];
      for (let i = 0; i < newHoles[mainIndex].length; i++) {
        this.holes[mainIndex < 6 ? mainIndex - i : mainIndex + i].push(
          newHoles[mainIndex][i]
        );
      }
      this.stores[mainIndex < 6 ? this.store1Index : this.store2Index].push(
        lastStone
      );
      this.turn(mainIndex, false);
    } else this.defaultAction(mainIndex, currentIndex, count);
  }

  defaultAction(mainIndex: number, currentIndex: number, count: number) {
    if (count == 1) {
      const nextHoleIndex: number =
        mainIndex < 6 ? mainIndex - 1 : currentIndex + 1;
      const nextHoleIndexLength = this.holes[nextHoleIndex].length;
      const oppositeIndexLength = this.holes[this.oppositeIndex].length;

      if (
        (nextHoleIndexLength == 0 && oppositeIndexLength == 0) ||
        nextHoleIndexLength != 0
      ) {
        this.pushToNextHoleIndex(nextHoleIndex, mainIndex);
        return;
      }
      if (nextHoleIndexLength == 0 && oppositeIndexLength != 0) {
        this.nextIndexEqual0AndOppositeIndexNotEqual0(mainIndex);
        return;
      }
    }
    if (count > 1) this.stoneCountsMoreThanOne(mainIndex, currentIndex, count);
  }

  //* begin:: #DefaultAction - taş sayısı 1 ise
  nextIndexEqual0AndOppositeIndexNotEqual0(mainIndex: number) {
    const storeIndex: number =
      mainIndex < 6 ? this.store1Index : this.store2Index;
    this.stores[storeIndex].push(this.holes[mainIndex].shift());
    this.holes[this.oppositeIndex].forEach((x: string) => {
      this.stores[storeIndex].push(x);
    });
    this.holes[this.oppositeIndex] = [];
    this.turn(mainIndex);
    this.finishCheck(mainIndex);
  }

  pushToNextHoleIndex(nextHoleIndex: number, mainIndex: number) {
    this.holes[nextHoleIndex].push(this.holes[mainIndex].shift());
    this.turn(mainIndex);
  }
  //* end:: #DefaultAction - taş sayısı 1 ise

  // begin:: #DefaultAction - taş sayısı 1'den fazla ise
  stoneCountsMoreThanOne(
    mainIndex: number,
    currentIndex: number,
    count: number
  ) {
    const currentIndexPluscount = currentIndex + count;

    if (currentIndexPluscount >= 0)
      this.stoneCountIsMoreThanOneAndNextIndexIsNotStore(
        mainIndex,
        currentIndex,
        count
      );
  }

  stoneCountIsMoreThanOneAndNextIndexIsNotStore(
    mainIndex: number,
    currentIndex: number,
    count: number
  ) {
    const newHoles = JSON.parse(JSON.stringify(this.holes));
    this.holes[mainIndex] = [];
    let targetHole = newHoles[mainIndex];
    let k = 0;

    for (let i = 0; i < targetHole.length; i++) {
      let newCurrentIndex = currentIndex + i;
      let indexToPush = targetHole[i];

      if (currentIndex < 6)
        this.currentIndexLessThanSix(
          currentIndex,
          indexToPush,
          i,
          mainIndex,
          count,
          targetHole.length
        );
      else {
        if (newCurrentIndex < 12) this.holes[newCurrentIndex].push(indexToPush);

        if (newCurrentIndex == 12)
          this.stores[this.store2Index].push(indexToPush);

        if (newCurrentIndex > 12) {
          this.holes[this.player1LastIndexValue - k].push(indexToPush);
          k = k + 1;
          this.totalStoneCheck(currentIndex, i, count, targetHole.length);
        }
      }
    }
    this.turn(mainIndex);
  }

  currentIndexLessThanSix(
    currentIndex: number,
    indexToPush: string,
    i: number,
    mainIndex: number,
    count: number,
    targetHoleLength: number
  ) {
    let newCurrentIndex = currentIndex + i;

    if (newCurrentIndex + 1 < 7) this.holes[mainIndex - i].push(indexToPush);
    if (newCurrentIndex + 1 == 7)
      this.stores[this.store1Index].push(indexToPush);
    if (newCurrentIndex + 1 > 7) {
      this.holes[currentIndex - 1 + i].push(indexToPush);
      this.totalStoneCheck(currentIndex, i, count, targetHoleLength);
    }
  }

  totalStoneCheck(
    currentIndex: number,
    i: number,
    count: number,
    targetHoleLength: number
  ) {
    if (i == count - 1) {
      //* If the number of stones in the slot where the last stone fell is even
      let newCurrentIndex =
        currentIndex < 6
          ? currentIndex + targetHoleLength - 2
          : this.player1LastIndexValue - (currentIndex + count - 14);
      let targetStore = currentIndex < 6 ? this.store1Index : this.store2Index;

      if (this.holes[newCurrentIndex].length % 2 == 0) {
        this.holes[newCurrentIndex].forEach((x: string) => {
          this.stores[targetStore].push(x);
        });
        this.holes[newCurrentIndex] = [];
      }
    }
  }
  // end:: #DefaultAction - taş sayısı 1'den fazla ise
}
