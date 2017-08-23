
"use strict"
document.addEventListener("DOMContentLoaded", function() {
  //переменная настроек
  var
    settings = new Settings(),
    //переменная статистики
    stats = new Stats(),
    //переменная, хранящая информацию о текущей игре
    ingameInfo = {
      playing: false,
      prevPepe: -1,
    },
    btnPlay = document.querySelector("#play");
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
      gameTime = +document.querySelector('#game-time__input').value;
      stats.setTimeLeft(+document.querySelector('#game-time__input').value);
    }
    this.getGameTime = function() {
      return gameTime;
    }
    this.setGameMode = function(modeString) {
      document.querySelector('input[name="game-mode__input"]:checked').value;
    }
    this.getGameMode = function() {
      return gameMode;
    }
    this.setFieldSize = function(sizeString) {
      fieldSize = +document.querySelector('input[name="game-field__input"]:checked').value;
    }
    this.getFieldSize = function() {
      return +fieldSize;
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
      score = scoreNumber;
      domScore.textContent = "Score: " + scoreNumber;
    }
    this.addScore = function(scoreToAdd) {
      score += scoreToAdd;
      domScore.textContent = "Score: " + score;
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

  function setSettings() {
    settings.setFieldSize();
    settings.setGameTime();
    settings.setGameMode();
  }
  //отображение актуальной статистики
  function showStats() {
    stats.showTimeLeft();
    stats.showScore();
    stats.showHighscore();
  };

  //ПЕРВИЧНЫЙ ВЫВОД ПОЛЯ И СТАТИСТИКИ
  drawField()
  showStats();

  //функция создания поля
  function drawField() {
    var
      //само игровое поле
      gameField = document.querySelector("#game-field"),
      //новая ячейка
      newCell = document.createElement('div');
    //присвоение ей класса
    newCell.className = 'game-block';
    //в зависимости от размера поля ему присваевается класс
    gameField.classList.remove('field-small', 'field-medium', 'field-large');
    switch (settings.getFieldSize()) {
      case 9:
        gameField.classList.add('field-small');
        break;
      case 16:
        gameField.classList.add('field-medium');
        break;
      case 25:
        gameField.classList.add('field-large');
        break;
      default:
        console.log('Ошибка построения поля. Количество ячеек - ' + settings.getFieldSize())
    }
    //полная очистка игрового поля
    gameField.innerHTML = '';
    //отрисовка поля
    for (var i = 0; i < settings.getFieldSize(); i++) {
      gameField.appendChild(newCell.cloneNode());
    }
  };

  //вывод клетки с Пепе
  function showPepe() {
    var
      //размер поля
      fieldSize = settings.getFieldSize(),
      //все клетки игрового поля
      cellsCollection = document.querySelectorAll('.game-block'),
      //случайное число в диапазоне количества клеток, отвечающее за положение нового Пепе
      rnd = Math.floor(Math.random() * (fieldSize));

    //если новый Пепе должен заспавниться на месте предыдущего
    while (rnd === ingameInfo.prevPepe) {
      //то задается новое случайное число по тем же правилам
      rnd = Math.floor(Math.random() * (fieldSize));
    }
    //переменная запоминает местоположение текущего Пепе
    ingameInfo.prevPepe = rnd;
    //случайная клетка становится активной
    cellsCollection[rnd].classList.add('game-block__active', 'pepe-standard');
    //на нее вешается листенер на клик
    cellsCollection[rnd].addEventListener('mousedown', clickOnPepe);
  };
  //обработка клика по активной клетке
  function clickOnPepe() {
    //клетка перестает быть активной
    this.classList.remove('game-block__active', 'pepe-standard');
    //удаляется листенер клика
    this.removeEventListener('mousedown', clickOnPepe);
    //в зависимости от размера поля (которое влияет на сложность) начисляются очки
    switch (settings.getFieldSize()) {
      //10 очков на маленьком поле
      case 9:
        stats.addScore(10);
        break;
      //12 очков на среднем поле
      case 16:
        stats.addScore(12);
        break;
      //15 очков на большом поле
      case 25:
        stats.addScore(15);
        break;
      default:
        console.log('Проверь размер поля')
        stats.addScore(10);
    }
    showPepe();
  }

  function play() {
    //если игра не идет в данный момент
    if (!ingameInfo.playing) {
      setSettings();
      stats.setTimeLeft(settings.getGameTime());
      stats.setScore(0);
      //показать статистику
      showStats();
      //нарисовать игровое поле
      drawField();
      //добавить первую активную клетку
      showPepe();
      ingameInfo.playing = true;
    }
    var gameSessionTimer = setInterval(function() {
      var timer = stats.getTimeLeft();
      timer--;
      stats.setTimeLeft(timer);
      if (timer === 0 || timer < 0) {
        clearInterval(gameSessionTimer);
        gameOver();
      }
    }, 1000)

    function gameOver() {
      document.querySelector('.pepe-standard').removeEventListener('mousedown', clickOnPepe);
      document.querySelector('.pepe-standard').classList.remove('game-block__active', 'pepe-standard');
      ingameInfo.playing = false;
      stats.setHighscore(stats.getScore());
      showStats();
    }
  }
  btnPlay.addEventListener('click', play);
});
