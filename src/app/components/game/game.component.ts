import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  hiddenCocktailName: string = '';
  instructions: string = '';
  category: string = '';
  glass: string = '';
  ingredients :string[] = [];
  imageUrl: string = '';
  attemptsLeft: number = 0;
  currentScore: number = 0;
  highScore: number = 0;
  cocktailName: string = '';  
  guess: string = '';
  gameOver: boolean = false;
  showError: boolean = false;
  showCorrect: boolean = false;
  isSkipButtonDisabled: boolean= false;

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.startNewGame();
    this.getHighScore();
  }


  handleGameData(data: any): void {
    this.hiddenCocktailName = data.hiddenCocktailName;
    this.instructions = data.currentCocktail.strInstructions;
    this.imageUrl = data.currentCocktail.strDrinkThumb;
    this.category = data.currentCocktail.strCategory;
    this.glass = data.currentCocktail.strGlass;
    this.ingredients = data.currentCocktail.ingredients;
    this.attemptsLeft = data.attemptsLeft;
    this.currentScore = data.score;
    this.cocktailName = data.currentCocktail.strDrink;
  }


 startNewGame(): void {
    this.isSkipButtonDisabled = false;
    this.gameService.startGame().subscribe(data => {
      this.handleGameData(data);
      if(data.hiddenCocktailName.replace(/[^_]/g, "").length <= 2) {
        this.isSkipButtonDisabled = true;
      }
    });
    this.getHighScore();
  }

  restartGame(): void {
    this.isSkipButtonDisabled = false;
    this.gameService.restartGame().subscribe(data => {  
      this.handleGameData(data);
      if(data.hiddenCocktailName.replace(/[^_]/g, "").length <= 2) {
        this.isSkipButtonDisabled = true;
      }
    });
    this.gameOver = false;
    this.getHighScore();
  }

  makeGuess(): void {
    if (!this.guess) return;

    const previousAttempts = this.attemptsLeft;

    this.gameService.makeGuess(this.guess.trim()).subscribe(data => {
      this.handleGameData(data);

      if (data.attemptsLeft === 0) {
        this.gameOver = true;
        this.getHighScore();
      }

      if (this.attemptsLeft < previousAttempts && this.guess != "UserSkippedRound") {
        this.showError = true;
        setTimeout(() => this.showError = false, 500); 
      }
    });

    if (this.cocktailName.toLowerCase().trim() === this.guess.toLowerCase().trim()) {
      this.isSkipButtonDisabled = false;
      this.showCorrect = true;
      setTimeout(() => this.showCorrect = false, 500); 
    }
    this.guess = '';
  }

  skip() :void{
    if(this.hiddenCocktailName.replace(/[^_]/g, "").length <=3){
      this.isSkipButtonDisabled = true;
    }
    this.guess = 'UserSkippedRound';
    this.makeGuess()
    this.guess = '';
    }

  getHighScore(): void {
    this.gameService.getHighScore().subscribe(score => {
      this.highScore = score;
    });
  }
}
