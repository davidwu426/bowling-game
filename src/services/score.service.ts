import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ScoreService {

  constructor(private http : HttpClient) { }

  headers = new HttpHeaders({
    'Access-Control-Allow-Origin':'*',
  });

  getScore(frame){
    return this.http.post("http://localhost:8080/score",{rolls : frame});
  }

  newGame(){
    this.http.post("http://localhost:8080/newgame",{}).subscribe();;
  }
}
