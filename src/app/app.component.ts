import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  itemsGroup: any[] = [
    [1,2,3,4], //items0
    [1,2,3,4], //items1
    [1,2,3,4], //items2
    [1,2,3,4], //items3
    [1,2,3,4], //items4
    [1,2,3,4], //items5
    [], //mancala1
    [1,2,3,4], //items7
    [1,2,3,4], //items8
    [1,2,3,4], //items9
    [1,2,3,4], //items10
    [1,2,3,4], //items11
    [1,2,3,4], //items12
    [], //mancala2
  ]

  player1: boolean = true;
  player2: boolean = false;
  isShowAlert: boolean = true;

  constructor(){}

  ngOnInit(): void {
    setTimeout(() => {
      this.isShowAlert = false;
    }, 3000);
  }

  finishGame(playerNumber: number){
    console.log(playerNumber);
    //oyun bitiş kontrolü
    let stoneCount: number = 0;
    //yuvalardaki toplam taş sayısı kontrolü
    for (let index = (playerNumber == 1 ? 0 : 7); index < (playerNumber == 1 ? 6 : 13); index++) {
      stoneCount += this.itemsGroup[index].length;
    }
    console.log(stoneCount);

    if(stoneCount == 0){
      for (let index = (playerNumber == 2 ? 0 : 7); index < (playerNumber == 2 ? 6 : 13); index++) {
        this.itemsGroup[index].forEach((x: any) => {
          this.itemsGroup[playerNumber == 2 ? 13 : 6].push(x);
          this.itemsGroup[index] = [];
        })
      }

      Swal.fire({
        title: "Game Over!",
        html: 'Winner player is ' + this.itemsGroup[6].length > this.itemsGroup[13].length ? 'Player1' : 'Player2',
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
        allowOutsideClick: false,
      })
      return;
    }
  }

  playerClicked(i: any,  count: number){
    //Player1 clicked
    if(i < 6){
      //yuvada bulunan 1 taş hareket ettiğinde, hareket edilen yuvanın karşısındaki yuva indexi'ni verir
      let oppositeIndex = (i == 0 ? 11 : (i == 1 ? 10 : (i == 2 ? 9 : (i == 3 ? 8 : (i == 4 ? 7 : 0)))))
      //yuvada sadece 1 tane taş varsa
      if (count == 1) {
        //bir sonraki yuvanın taş sayısı 0 değilse ve bir sonraki yuva hazine(store) değilse
        if(this.itemsGroup[i+1].length != 0 && (i+1) != 6){
          this.itemsGroup[i] = [];
          this.itemsGroup[i+1].push(1);
          this.player1 = false;
          this.player2 = true;
          return;
        }
        //bir sonraki yuvanın taş sayısı 0'a eşitse ve bir sonraki yuva hazine(store) değilse
        if(this.itemsGroup[i+1].length == 0 && (i+1) != 6){
          //karşı yuvanın taş sayısı 0 değilse
          if(this.itemsGroup[oppositeIndex].length != 0){
            //bir sonraki boş yuvamıza, şu anki yuvadan son taşı hareket ettirdiğimizde
            //karşı yuvanın taşlarını da kendi hazinemize(store) atarız.
            this.itemsGroup[oppositeIndex].forEach((x: any) => {
              this.itemsGroup[6].push(x);
            });
            this.itemsGroup[oppositeIndex] = [];
            this.itemsGroup[6].push(1);
            this.itemsGroup[i] = [];
            this.itemsGroup[i+1] = [];
            this.player1 = false;
            this.player2 = true;
            return;
          }
          //bir sonraki boş yuvamıza, şu anki yuvadan son taşı hareket ettirdiğimizde
          //karşı yuvada taş yoksa, kendi taşımız olduğu yerde kalır ve sıra rakibe geçer.
          if(this.itemsGroup[oppositeIndex].length == 0){
            this.itemsGroup[i] = [];
            this.itemsGroup[i+1].push(1);
            this.player1 = false;
            this.player2 = true;
            return;
          }
        }

        //bir sonraki yuva hazinemiz(store) ise yuvadaki son taşı hazineye bırakırız ve sıra yine bizde olur
        if((i+1) == 6){
          this.itemsGroup[i] = [];
          this.itemsGroup[6].push(1);
          this.player1 = true;
          this.player2 = false;
          this.finishGame(1);
          return;
        }

      }
      //yuvada 1'den fazla taş varsa
      else {
        this.itemsGroup[i] = [];
        this.itemsGroup[i].push(1);
        const constantEnd = (i+count)-1;
        let end = (i+count)-1;
        let isFirstEntry = true;
        for (let index = i+1 ; index <= end ; index++) {
          if(index > 12 && isFirstEntry){
            end = (end % 12) - 1;
            index = 0;
            isFirstEntry = false;
          }
          if(index == 13){
            index++;
          }
          this.itemsGroup[index].push(1);
        }
        //son taşın düşeceği yuva, hazinemiz ise
        if(end == 6){
          this.player1 = true;
          this.player2 = false;
        }
        //son taşın düşeceği yuva, karşı tarafın yuvası ise
        else if(end > 6){
          let endLength = this.itemsGroup[end].length;
          //son taşın düştüğü yuvadaki taş sayısı çift ise
          if( endLength % 2 == 0){
            this.itemsGroup[end].forEach((x: any) => {
              console.log(x);
              this.itemsGroup[6].push(x);
            });
            this.itemsGroup[end] = [];
            this.player1 = false;
            this.player2 = true;
            return;
          }
          //son taşın düştüğü yuvadaki taş sayısı tek ise
          if( endLength % 2 == 1){
            this.player1 = false;
            this.player2 = true;
            return;
          }
        }
        //son taşın düşeceği yuva, kendi yuvalarımızdan biri ise
        else{
          this.player1 = false;
          this.player2 = true;
        }
      }

    }

    //Player2 clicked
    if(i>6){
      //yuvada bulunan 1 taş hareket ettiğinde, hareket edilen yuvanın karşısındaki yuva indexi'ni verir
      let oppositeIndex = (i == 7 ? 4 : (i == 8 ? 3 : (i == 9 ? 2 : (i == 10 ? 1 : (i == 11 ? 0 : 0)))))
      //yuvada sadece 1 tane taş varsa
      if (count == 1) {
        //bir sonraki yuvanın taş sayısı 0 değilse ve bir sonraki yuva hazine(store) değilse
        if(this.itemsGroup[i+1].length != 0 && (i+1) != 13){
          this.itemsGroup[i] = [];
          this.itemsGroup[i+1].push(1);
          this.player1 = true;
          this.player2 = false;
          return;
        }
        //bir sonraki yuvanın taş sayısı 0'a eşitse ve bir sonraki yuva hazine(store) değilse
        if(this.itemsGroup[i+1].length == 0 && (i+1) != 13){
          //karşı yuvanın taş sayısı 0 değilse
          if(this.itemsGroup[oppositeIndex].length != 0){
            //bir sonraki boş yuvamıza, şu anki yuvadan son taşı hareket ettirdiğimizde
            //karşı yuvanın taşlarını da kendi hazinemize(store) atarız.
            this.itemsGroup[oppositeIndex].forEach((x: any) => {
              this.itemsGroup[13].push(x);
            });
            this.itemsGroup[oppositeIndex] = [];
            this.itemsGroup[13].push(1);
            this.itemsGroup[i] = [];
            this.itemsGroup[i+1] = [];
            this.player1 = true;
            this.player2 = false;
            return;
          }
          //bir sonraki boş yuvamıza, şu anki yuvadan son taşı hareket ettirdiğimizde
          //karşı yuvada taş yoksa, kendi taşımız olduğu yerde kalır ve sıra rakibe geçer.
          if(this.itemsGroup[oppositeIndex].length == 0){
            this.itemsGroup[i] = [];
            this.itemsGroup[i+1].push(1);
            this.player1 = true;
            this.player2 = false;
            return;
          }
        }

        //bir sonraki yuva hazinemiz(store) ise yuvadaki son taşı hazineye bırakırız ve sıra yine bizde olur
        if((i+1) == 13){
          this.itemsGroup[i] = [];
          this.itemsGroup[13].push(1);
          this.player1 = false;
          this.player2 = true;
          this.finishGame(2);
          return;
        }

      }
      //yuvada 1'den fazla taş varsa
      else {
        this.itemsGroup[i] = [];
        this.itemsGroup[i].push(1);
        const constantEnd = (i+count)-1;
        let end = (i+count)-1;
        let isFirstEntry = true;
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

          this.itemsGroup[index].push(1);
        }
        //son taşın düşeceği yuva, hazinemiz ise
        if(end == 13){
          this.player1 = false;
          this.player2 = true;
        }
        //son taşın düşeceği yuva, karşı tarafın yuvası ise
        else if(end < 6){
          let endLength = this.itemsGroup[end].length;
          //son taşın düştüğü yuvadaki taş sayısı çift ise
          if( endLength % 2 == 0){
            this.itemsGroup[end].forEach((x: any) => {
              console.log(x);
              this.itemsGroup[13].push(x);
            });
            this.itemsGroup[end] = [];
            this.player1 = true;
            this.player2 = false;
            return;
          }
          //son taşın düştüğü yuvadaki taş sayısı tek ise
          if( endLength % 2 == 1){
            this.player1 = true;
            this.player2 = false;
            return;
          }
        }
        //son taşın düşeceği yuva, kendi yuvalarımızdan biri ise
        else{
          this.player1 = true;
          this.player2 = false;
        }
      }

    }


  }

}


