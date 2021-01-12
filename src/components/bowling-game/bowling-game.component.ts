import { Component, OnInit, OnDestroy} from '@angular/core';
import { ScoreService } from '../../services/score.service'


@Component({
  selector: 'app-bowling-game',
  templateUrl: './bowling-game.component.html',
  styleUrls: ['./bowling-game.component.scss']
})
export class BowlingGameComponent implements OnInit {

  constructor(private scoreService : ScoreService) { }

  frames :any[][]= [[],[],[],[],[],[],[],[],[],[]];
  scores : any[] = [null,null,null,null,null,null,null,null,null,null];
  frameIndex = 0;
  gameOver : boolean = false;

  validNumbers : string[] =["0","1","2","3","4","5","6","7","8","9","10",];
  validSpare : string[] = ["spare"]
  validStrike : string[] = ["x","strike"];
  validMiss : string[] = ["miss"]
  validInput : boolean = true;
  scoreServiceSubscriber;

  ngOnInit() {
    this.scoreService.newGame();
  }

  ngOnDestroy(){
    this.scoreServiceSubscriber.unsubscribe();
  }

  addRollToFrame(score : string){
    this.validInput = this.validateScoreInput(score);
    if(this.validInput){
      if(this.validNumbers.indexOf(score) != -1){
        this.addNumberToScore(score);
      }else if(this.validSpare.indexOf(score.toLocaleLowerCase()) != -1){
        this.addSpareToScore();
      }else if(this.validStrike.indexOf(score.toLocaleLowerCase()) != -1){
        this.addStrikeToScore();
      }else{
        this.addMissToScore();
      }
      this.checkIfGameOver();
      if(this.gameOver){
        this.getScoreAndReduce();
      }
      this.validInput = true;
    }
  }

  validateScoreInput(score : string){
    let currentFrame = this.frames[this.frameIndex];
    if(this.validNumbers.indexOf(score) != -1){
      if(currentFrame.length ==0){
        return true;
      }else if(parseInt(score) + (currentFrame[currentFrame.length-1] == "-" ? 0 : parseInt(currentFrame[currentFrame.length-1])) <= 10){
        return true;
      }else if( this.frameIndex == 9 && (currentFrame[currentFrame.length-1] == "X" || currentFrame[currentFrame.length-1] =="/")){
        return true;
      }
      else{
        return false;
      }
    }else if(this.validMiss.indexOf(score.toLocaleLowerCase()) != -1){
      return true;
    }else if(this.validStrike.indexOf(score.toLocaleLowerCase()) != -1){
      if(currentFrame.length == 0){
        return true;
      }else if(this.frameIndex === 9 && (currentFrame[currentFrame.length-1] == "/" || currentFrame[currentFrame.length-1] == "X")){
        return true;
      }else{
        return false;
      }
    }else if(this.validSpare.indexOf(score.toLocaleLowerCase()) != -1){
      if(currentFrame.length == 0){
        return false;
      }else if(this.validNumbers.indexOf(currentFrame[currentFrame.length-1]) != -1 || currentFrame[currentFrame.length-1] == "-"){
        return true;
      }else{
        return false;
      }
    }
    else{
      return false
    }
  }
  
  addNumberToScore(score){
    let currentFrame = this.frames[this.frameIndex];
    if(currentFrame.length == 0){
      if(score == "10"){
        this.frames[this.frameIndex].push("X");
        this.frameIndex++;
      }else if(score == "0"){
        this.frames[this.frameIndex].push("-");
      }else{
        this.frames[this.frameIndex].push(score);
      }
    }else if((currentFrame[currentFrame.length-1] == "-" ? 0 : parseInt(currentFrame[currentFrame.length-1])) + parseInt(score) == 10){
      this.frames[this.frameIndex].push("/");
    }else{
      if(score == "0"){
        this.frames[this.frameIndex].push("-");
      }
      else{
        this.frames[this.frameIndex].push(score);
      }
    }
    if(currentFrame.length == 2 && this.frameIndex < 9){
      this.getScoreAndReduce();
      this.frameIndex++;
    }
  }

  addSpareToScore(){
    let currentFrame = this.frames[this.frameIndex];
    currentFrame.push("/");
    if(this.frameIndex <9){
      this.getScoreAndReduce();
      this.frameIndex++; 
    }
  }

  addStrikeToScore(){
    this.frames[this.frameIndex].push("X");
    if(this.frameIndex <9){
      this.getScoreAndReduce();
      this.frameIndex++; 
    }
  }

  addMissToScore(){
    this.frames[this.frameIndex].push("-");
    if(this.frames[this.frameIndex].length == 2 && this.frameIndex < 9){
      this.getScoreAndReduce();
      this.frameIndex++;
    }
  }

  checkIfGameOver(){
    if(this.frameIndex == 9){
      let currentFrame  = this.frames[this.frameIndex];
      if(currentFrame.length ==3){
        console.log('length is 3');
        this.gameOver = true;
      }else if(currentFrame.length == 2 && currentFrame[0] != "X" && currentFrame[1] != "/"){
        this.gameOver= true;
      }
    }
  }

  reset(){
    this.frames = [[],[],[],[],[],[],[],[],[],[]];
    this.scores = [null,null,null,null,null,null,null,null,null,null];
    this.gameOver = false;
    this.frameIndex = 0;
    this.scoreService.newGame();
  }

  getScoreAndReduce(){
    this.scoreServiceSubscriber = this.scoreService.getScore(this.frames[this.frameIndex]).subscribe((scores :any[])=>{
      let initialValue = 0;
      for(var i = 0 ; i< scores.length;i++){
        initialValue += scores[i];
        this.scores[i] = initialValue;
      }
    });
  }
}
