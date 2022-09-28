import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  player1Holes: any[] = [];
  player2Holes: any[] = [];
  store1: string[] = [];
  store2: string[] = [];

  player1: boolean = true;
  player2: boolean = false;

  colors: string[] = [
    // '#E53535', //Kırmızı
    // '#D71AD0', //Pembe
    // '#1985F0', //Mavi
    // '#19F04C', //Yeşil
    // '#F8FF2F'  //Sarı
    // '#52012a', //Bordo
    // '#7cb9ef', //Mavi
    '#000'
  ]

  constructor() {}

  finishGame(){
    //oyun bitiş kontrolü
    let totalStoneCountOfFirstPlayer: number = 0;
    let totalStoneCountOfSecondPlayer: number = 0;
    //yuvalardaki toplam taş sayısı kontrolü
    for (let index = 0; index < 6; index++) {
      totalStoneCountOfFirstPlayer += this.player1Holes[index].length;
      totalStoneCountOfSecondPlayer += this.player2Holes[index].length;
    }

    console.log(totalStoneCountOfFirstPlayer);
    console.log(totalStoneCountOfSecondPlayer);
    if (totalStoneCountOfFirstPlayer == 0 ) {
      for (let i = 0; i < 6; i++) {
        this.player2Holes[i].forEach((x: string) => {
          this.store1.push(x);
        })
        this.player2Holes[i] = [];
      }

      const totalStore1Count: number = this.store1.length;
      const totalStore2Count: number = this.store2.length;
      Swal.fire({
        title: "Game Over!",
        text: "Winner " + (totalStore1Count > totalStore2Count ? 'Player1' : 'Player2'),
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
        allowOutsideClick: false,
      })
      return;
    }

    if (totalStoneCountOfSecondPlayer == 0 ) {
      for (let i = 0; i < 6; i++) {
        this.player1Holes[i].forEach((x: string) => {
          this.store2.push(x);
        })
        this.player1Holes[i] = [];
      }
      const totalStore1Count: number = this.store1.length;
      const totalStore2Count: number = this.store2.length;
      Swal.fire({
        title: "Game Over!",
        text: "Winner " + (totalStore1Count > totalStore2Count ? 'Player1' : 'Player2'),
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
        allowOutsideClick: false,
      })
      return;
    }
  }
}
