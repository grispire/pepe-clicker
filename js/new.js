"use strict"
document.addEventListener("DOMContentLoaded", function() {
  //конструктор объекта настроек
  function Settings() {
    //получение времени из input[type="range"]
    var
      gameTime = +document.querySelector('#game-time__input').value,
      //получение режима игры из input[type="radio"]
      gameMode = document.querySelector('input[name="game-mode__input"]:checked').value,
      //получение размера поля из input[type="radio"]
      fieldSize = document.querySelector('input[name="game-field__input"]:checked').value;
    this.setGameTime = function(timeNumber) {
      gameTime = +timeNumber;
    }
    this.getGameTime = function() {
      return gameTime;
    }
    this.setGameMode = function(modeString) {
      gameMode = modeString;
    }
    this.getGameMode = function() {
      return gameMode;
    }
    this.setFieldSize = function(sizeString) {
      fieldSize = sizeString;
    }
    this.getFieldSize = function() {
      return fieldSize;
    }
  };

  //конструктор объекта статистики
  function Stats() {
    var
      timeLeft = 0,
      score = 0,
      highscore = (localStorage.getItem('highscore')) ? +localStorage.getItem('highscore') : 0,
      domTimeLeft = document.querySelector("#game-timeLeft h4"),
      domScore = document.querySelector("#game-score h4"),
      domHighscore = document.querySelector("#game-highscore h4")
    this.setTimeLeft = function(timeNumber) {
      timeLeft = +timeNumber;
      this.showTimeLeft();
    }
    this.getTimeLeft = function() {
      return timeLeft;
    }
    this.showTimeLeft = function() {
      domTimeLeft.textContent = "Time left: " + timeLeft;
    }
    this.setScore = function(scoreNumber) {
      score = +scoreNumber;
      domScore.textContent = "Score: " + scoreNumber;
    }
    this.getScore = function() {
      return score;
    }
    this.showScore = function() {
      domScore.textContent = "Score: " + score;
    }
    this.setHighscore = function(highscoreNumber) {
      if (highscoreNumber > highscore) {
        highscore = +highscoreNumber;
        localStorage.setItem('highscore', highscoreNumber)
      }
    }
    this.getHighscore = function() {
      return highscore;
    }
    this.showHighscore = function() {
      domHighscore.textContent = "Highscore: " + highscore;
    }
  };
  //переменная настроек
  var settings = new Settings();
  //переменная статистики
  var stats = new Stats();

  function showStats() {
    stats.showTimeLeft();
    stats.showScore();
    stats.showHighscore();
  }
  showStats();

  //слежка за изменением настроек в блоке настроек
  document.querySelector("#game-settings").addEventListener("change", setSettings);
  //функция, изменяющая объект settings, отвечающий за настройки
  //сам игровой процесс изменится после запуска новой игры
  function setSettings(event) {
    //получено изменение размера поля, будет изменен размера поля
    if (event.target.name == 'game-field__input') settings.setFieldSize(event.target.value);
    //получено изменение режима игры, будет изменен режим игры
    if (event.target.name == 'game-mode__input') settings.setGameMode(event.target.value);
    //получено изменение времени, будет изменено время
    if (event.target.name == 'game-time__input') settings.setGameTime(event.target.value);
    console.log('Настройки изменены. Игровое время: ' + settings.getGameTime() + '; Игровой режим: ' + settings.getGameMode() + '; Размер поля: ' + settings.getFieldSize());
  };

});
