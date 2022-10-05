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
  firstStoreValue: number = 6;

  //* begin:: Inital Settings
  ngOnInit(): void {
    this.createHoles();
    this.createStores();
  }

  //* yuvaları oluşturan metot
  createHoles() {
    for (let i = 0; i < this.defaultHoleCount; i++) {
      this.holes.push([]);
    }
    this.distributeStones();
  }

  //* hazneleri oluşturan metot
  createStores() {
    for (let i = 0; i < 2; i++) {
      this.stores.push([]);
    }
  }

  //* taşları dağıtan metot
  distributeStones() {
    for (let i = 0; i < this.defaultStoneCount; i++) {
      this.holes.forEach((x) => {
        const randNumber = Math.floor(Math.random() * this.colors.length);
        x.push(this.setColors(randNumber));
      });
    }
  }

  //* renk dizisi
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

  //* renkleri belirleyen metot
  setColors(randomNumber: number) {
    return this.colors[randomNumber];
  }

  //* sıranın kimde olduğunu belirleyen metot
  turn(mainIndex: number, isPlayer1: boolean = true) {
    if (mainIndex > 5) {
      this.isPlayer1 = isPlayer1;
      this.isPlayer2 = !isPlayer1;
    } else {
      this.isPlayer1 = !isPlayer1;
      this.isPlayer2 = isPlayer1;
    }
  }

  //* oyun bitiş kontrolü
  finishCheck(currentIndex: number) {
    let total: number = 0;
    let initalValue = currentIndex < this.firstStoreValue ? 0 : 6;
    let finishValue = currentIndex < this.firstStoreValue ? 5 : 11;
    let oppositeInitialValue = currentIndex < this.firstStoreValue ? 6 : 0;
    let oppositeFinishValue = currentIndex < this.firstStoreValue ? 11 : 5;
    let firstStore = this.stores[this.store1Index];
    let secondStore = this.stores[this.store2Index];
    let currentStore = currentIndex < this.firstStoreValue ? firstStore : secondStore;

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

    let winner = firstStore.length > secondStore.length && firstStore.length != secondStore.length ?
    'Winner Player1' : 'Winner Player2';

    let equal = firstStore.length == secondStore.length ? 'Winner Player1 & Player2' : ''

    Swal.fire({
      title: 'Game Over!',
      text: winner || equal,
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
      allowOutsideClick: false,
    });
    return;
  }

  //* end:: Inital Settings

  playerClicked(mainIndex: number, currentIndex: number, count: number) {
    this.oppositeIndex = mainIndex < this.firstStoreValue ? 10 - currentIndex : currentIndex - 5;
    switch (currentIndex + count) {
      //* 1) #FirstAction - taş sayısı 1 ise ve bir sonraki yuva, store1 ise
      case 6:
        this.stoneCountIsOneAndNextIndexIsStore(mainIndex, currentIndex, count);
        break;

      //* 2) #SecondAction - taş sayısı 1'den fazla ise ve son yuva, store1 ise
      case 7:
        this.stoneCountIsMoreThanOneAndNextIndexIsStore(mainIndex, currentIndex, count);
        break;

      //* 3) #ThirdAction - taş sayısı 1 ise ve bir sonraki yuva, store2 ise
      case 12:
        this.stoneCountIsOneAndNextIndexIsStore(mainIndex, currentIndex, count);
        break;

      //* 4) #FourthAction - taş sayısı 1'den fazla ise ve son yuva, store2 ise
      case 13:
        this.stoneCountIsMoreThanOneAndNextIndexIsStore(mainIndex, currentIndex, count);
        break;

      //* 5) #DefaultAction - taş sayısı 1 veya 1'den fazla olduğunda ve hazneye taş düşmediğinde çalışacak metot
      default:
        this.defaultAction(mainIndex, currentIndex, count);
        break;
    }
  }

  //* taş sayısı 1 ise ve bir sonraki yuva, store1/store2 ise
  stoneCountIsOneAndNextIndexIsStore(
    mainIndex: number,
    currentIndex: number,
    count: number
  ) {
    if (count == 1) {
      const storeIndex = mainIndex < this.firstStoreValue ? this.store1Index : this.store2Index;
      this.stores[storeIndex].push(this.holes[mainIndex].shift());
      this.turn(mainIndex, false);
      this.finishCheck(mainIndex);
    } else this.defaultAction(mainIndex, currentIndex, count);
  }

  //* taş sayısı 1'den fazla ise ve son yuva, store1/store2 ise
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
        this.holes[mainIndex < this.firstStoreValue ? mainIndex - i : mainIndex + i].push(
          newHoles[mainIndex][i]
        );
      }
      this.stores[mainIndex < this.firstStoreValue ? this.store1Index : this.store2Index].push(
        lastStone
      );
      this.turn(mainIndex, false);
    } else this.defaultAction(mainIndex, currentIndex, count);
  }

  //* taş sayısı 1 veya 1'den fazla olduğunda ve hazneye taş düşmediğinde çalışacak metot
  defaultAction(mainIndex: number, currentIndex: number, count: number) {
    if (count == 1) {
      const nextHoleIndex: number =
        mainIndex < this.firstStoreValue ? mainIndex - 1 : currentIndex + 1;
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
    if (count > 1) this.defaultActionMoreThanOne(mainIndex, currentIndex, count);
  }

  //* begin:: #DefaultAction - taş sayısı 1 ise

  //* bir sonraki yuvanın taş sayısı 0 ve karşı yuvanın taş sayısı 0 değilse
  nextIndexEqual0AndOppositeIndexNotEqual0(mainIndex: number) {
    const storeIndex: number =
      mainIndex < this.firstStoreValue ? this.store1Index : this.store2Index;
    this.stores[storeIndex].push(this.holes[mainIndex].shift());
    this.holes[this.oppositeIndex].forEach((x: string) => {
      this.stores[storeIndex].push(x);
    });
    this.holes[this.oppositeIndex] = [];
    this.turn(mainIndex);
    this.finishCheck(mainIndex);
  }

  //* bir sonraki yuvanın taş sayısı 0 ve karşı yuvanın taş sayısı 0 ise
  pushToNextHoleIndex(nextHoleIndex: number, mainIndex: number) {
    this.holes[nextHoleIndex].push(this.holes[mainIndex].shift());
    this.turn(mainIndex);
  }

  //* end:: #DefaultAction - taş sayısı 1 ise

  // begin:: #DefaultAction - taş sayısı 1'den fazla ise
  defaultActionMoreThanOne(
    mainIndex: number,
    currentIndex: number,
    count: number
  ) {
    const currentIndexPluscount = currentIndex + count;

    if (currentIndexPluscount >= 0)
      //* taş sayısı 1'den fazla ise ve bir sonraki yuva hazne değilse
      this.stoneCountIsMoreThanOneAndNextIndexIsNotStore(
        mainIndex,
        currentIndex,
        count
      );
  }

  //* taş sayısı 1'den fazla ise ve bir sonraki yuva hazne değilse
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

      if (currentIndex < this.firstStoreValue)
        //* son taş yuvaya
        this.currentIndexLessThanSix(
          currentIndex,
          indexToPush,
          i,
          mainIndex,
          count,
          targetHole.length
        );
      else {
        //* taş, kendi tarafına düşüyorsa veya kendi haznesine düşüyorsa çalışacak metot
        this.lastStoneNotInOpposite(newCurrentIndex, indexToPush, mainIndex, i);

        //* taş, karşı oyuncunun tarafına geçiyorsa
        if (newCurrentIndex > 12) {
          this.holes[currentIndex + i > 18 ? this.firstStoreValue :  this.player1LastIndexValue - k].push(indexToPush);
          k = k + 1;
          this.totalStoneCheck(currentIndex, i, count, targetHole.length);
        }
      }
    }
    this.turn(mainIndex);
  }

  //* taş karşı oyuncunun tarafına geçtiğinde
  currentIndexLessThanSix(
    currentIndex: number,
    indexToPush: string,
    i: number,
    mainIndex: number,
    count: number,
    targetHoleLength: number
  ) {
    let newCurrentIndex = currentIndex + i;
    let nextIndex = newCurrentIndex < 13 ? (newCurrentIndex - 1) : (this.player1LastIndexValue - (i - 8))

    //* taş, kendi tarafına düşüyorsa veya kendi haznesine düşüyorsa çalışacak metot
    this.lastStoneNotInOpposite(newCurrentIndex, indexToPush, mainIndex, i);

    //* taş, karşı oyuncunun tarafına geçiyorsa
    if (newCurrentIndex + 1 > 7) {
      this.holes[nextIndex].push(indexToPush);
      this.totalStoneCheck(currentIndex, i, count, targetHoleLength);
    }
  }

  //*(Player1 ve Player2 ortak metot) taş, kendi tarafına düşüyorsa veya kendi haznesine düşüyorsa çalışacak metot
  lastStoneNotInOpposite(newCurrentIndex: number, indexToPush: string, mainIndex: number, i: number){
    let conditionValue = mainIndex < this.firstStoreValue ? 7 : 12
    let mainValue = mainIndex < this.firstStoreValue ? newCurrentIndex + 1 : newCurrentIndex
    let valueOfHole = mainIndex < this.firstStoreValue ? mainIndex - i : newCurrentIndex
    let valueOfStore = mainIndex < this.firstStoreValue ? this.store1Index : this.store2Index

    if (mainValue < conditionValue) this.holes[valueOfHole].push(indexToPush);
    if (mainValue == conditionValue) this.stores[valueOfStore].push(indexToPush);

  }

  //* taşlar yuvalara düştüğünde, son yuvanın toplam taş sayısının çift veya tek kontrolünün yapıldığı metot
  totalStoneCheck(
    currentIndex: number,
    i: number,
    count: number,
    targetHoleLength: number
  ) {
    let ownSide = currentIndex < this.firstStoreValue ?  currentIndex + count < 14 : currentIndex + count < 20
    if (i == count - 1 && ownSide) {
      //* son taş yuvaya düştüğünde toplam taş sayısı çift ise
      let newCurrentIndex =
        currentIndex < this.firstStoreValue
          ? currentIndex + targetHoleLength - 2
          : this.player1LastIndexValue - (currentIndex + count - 14);
      let targetStore = currentIndex < this.firstStoreValue ? this.store1Index : this.store2Index;

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
