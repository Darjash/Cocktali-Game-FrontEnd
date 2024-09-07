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

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.startNewGame();
    this.getHighScore();
  }

  startNewGame(): void {
    this.gameService.startGame().subscribe(data => {
      this.hiddenCocktailName = data.hiddenCocktailName;
      this.attemptsLeft = data.attemptsLeft;
      this.currentScore = data.score;
      this.cocktailName = data.currentCocktail.strDrink;
      this.instructions = data.currentCocktail.strInstructions;
      this.imageUrl = data.currentCocktail.strDrinkThumb;
      this.category = data.currentCocktail.strCategory;
      this.glass = data.currentCocktail.strGlass;
      this.ingredients = data.currentCocktail.ingredients;
    });
    this.getHighScore();
  }
  restartGame(): void {
    this.gameService.restartGame().subscribe(data => {  
      this.hiddenCocktailName = data.hiddenCocktailName;
      this.instructions = data.currentCocktail.strInstructions;
      this.imageUrl = data.currentCocktail.strDrinkThumb;
      this.category = data.currentCocktail.strCategory;
      this.glass = data.currentCocktail.strGlass;
      this.ingredients = data.currentCocktail.ingredients;
      this.attemptsLeft = data.attemptsLeft;
      this.currentScore = data.score;
      this.cocktailName = data.currentCocktail.strDrink;
    });
    this.gameOver = false;
    this.getHighScore();
  }

  makeGuess(): void {
    if (!this.guess) return;

    this.gameService.makeGuess(this.guess.trim()).subscribe(data => {
      this.hiddenCocktailName = data.hiddenCocktailName;
      this.attemptsLeft = data.attemptsLeft;
      this.currentScore = data.score;

      this.cocktailName = data.currentCocktail.strDrink;
      this.instructions = data.currentCocktail.strInstructions;
      this.category = data.currentCocktail.strCategory;
      this.glass = data.currentCocktail.strGlass;
      this.imageUrl = data.currentCocktail.strDrinkThumb;
      this.ingredients = data.currentCocktail.ingredients;

      if (data.attemptsLeft === 0) {
        this.gameOver = true;
        this.getHighScore();
      }
    });
    
    this.guess = '';
  }

  getHighScore(): void {
    this.gameService.getHighScore().subscribe(score => {
      this.highScore = score;
    });
  }
}
