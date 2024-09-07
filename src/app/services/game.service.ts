import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private baseUrl = 'http://localhost:8080/game';

  constructor(private http: HttpClient) {}

  startGame(): Observable<any> {
    return this.http.get(`${this.baseUrl}/start`);
  }
  restartGame(): Observable<any> {
    return this.http.get(`${this.baseUrl}/restart`);
  }

  makeGuess(guess: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/guess`, {}, { params: { guess } });
  }

  getHighScore(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/highscore`);
  }
}
