
"use strict"
//переменная настроек
var
  //игровое поле
  gameField = document.querySelector("#game-field"),
  //настройки
  settings = new Settings(),
  //статистика
  stats = new Stats(),
  //игровые звуки
  sounds = {
    tick: document.querySelector('#sound-tick'),
    timeEnd: document.querySelector("#sound-timeout"),
  },
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

//функция отвечает за распределение очков
function scorer() {
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
}

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
};

//игровое поле получает листенер на mousedown
gameField.addEventListener('mousedown', function(e) {
  //в переменную записывается кликнутый блок
  var gameBlock = e.target.closest('.game-block');
  //если он существует - вызывается обработчик клика по Пепе
  if (gameBlock !== null) {
    clickOnPepe(gameBlock);
  }
});
//также слушает клавиатуру
document.addEventListener('keydown', function(e) {
  keydownOnPepe(+e.key);
});

//обработка клика по активной клетке
function clickOnPepe(gameBlock) {
  if (gameBlock.classList.contains('game-block__active')) {
    //клетка перестает быть активной
    gameBlock.classList.remove('game-block__active', 'pepe-standard');
    scorer();
    //отображается новый Пепе
    showPepe();
  }
}
//нампад для взаимодействия с Пепе
function keydownOnPepe(key) {
  //это костыль, который сделан из-за расположения нампада и клеток относительно друг друга
  //клетки идут сверху вниз, а нампад снизу вверх
  if (key >= 7 && key <= 9) {
    key -= 6;
  } else if (key >= 1 && key <= 3) {
    key += 6;
  }
  //если нажатая кнопка совпадает с положением пепе на игровом поле
  if (ingameInfo.prevPepe === key - 1) {
    //удаляется активная клетка
    document.querySelector('.pepe-standard').classList.remove('game-block__active', 'pepe-standard');
    scorer();
    showPepe();
  }
}

function play() {
  //если игра не идет в данный момент
  if (!ingameInfo.playing) {
    setSettings();
    //передает в статистику время на игру
    stats.setTimeLeft(settings.getGameTime());
    //обнуляет очки
    stats.setScore(0);
    //показать статистику
    showStats();
    //нарисовать игровое поле
    drawField();
    //добавить первую активную клетку
    showPepe();
    ingameInfo.playing = true;
    //листенер клавиатуры
  }
  //игровой таймер
  var gameSessionTimer = setInterval(function() {
    //переменная получает из статистики оставшееся игровое время, изначально полученное из настроек
    var timer = stats.getTimeLeft();
    //переменная уменьшается с каждой итерацией интервала
    timer--;
    //уменьшенное время запоминается
    stats.setTimeLeft(timer);
    //если осталось меньше 10 секунд - включается тиаканье часов
    if (timer < 11 && timer > 0) {
      sounds.tick.play();
    }
    //если время вышло
    if (timer === 0 || timer < 0) {
      //очищается таймер
      clearInterval(gameSessionTimer);
      //заканчивается игра
      gameOver();
      //в конце игры звучит гудок
      sounds.timeEnd.play();
    }
  }, 1000)

  //функция окончания игры
  function gameOver() {
    //удаляется листенер с клика
    document.querySelector('.pepe-standard').removeEventListener('mousedown', clickOnPepe);
    //удаляется активная клетка
    document.querySelector('.pepe-standard').classList.remove('game-block__active', 'pepe-standard');
    //переменная, отвечающая за состояние игры
    ingameInfo.playing = false;
    //устанавливается highscore
    stats.setHighscore(stats.getScore());
    //обновляется вся статистика
    showStats();
  }
}
//запуск игры
btnPlay.addEventListener('click', play);
