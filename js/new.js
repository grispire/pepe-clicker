
"use strict"
//переменная настроек
var
  //игровое поле
  gameField = document.querySelector("#game-field"),
  //настройки
  settings = new Settings(),
  //статистика
  stats = new Stats(),
  //поп-апы
  popups = new Popups(),
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
  timers = {},
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
    docScore = document.querySelector("#game-score h4"),
    popupScore = document.querySelector("#gameover-score");
  this.setTimeLeft = function(timeNumber) {
    timeLeft = +timeNumber;
    this.showTimeLeft();
  }
  this.getTimeLeft = function() {
    return timeLeft;
  }
  this.showTimeLeft = function() {
    document.querySelector("#game-timeLeft h4").textContent = "Time left: " + timeLeft;
  }
  this.setScore = function(scoreNumber) {
    score = scoreNumber;
    docScore.textContent = "Score: " + scoreNumber;
  }
  this.addScore = function(scoreToAdd) {
    score += scoreToAdd;
    docScore.textContent = "Score: " + score;
  }
  this.getScore = function() {
    return score;
  }
  this.showScore = function() {
    docScore.textContent = "Score: " + score;
    popupScore.textContent = score;
  }
  this.setHighscore = function(highscoreNumber) {
    if (highscoreNumber > highscore) {
      document.querySelector("#gameover-highscore").textContent = 'New highscore - ' + highscoreNumber + '! (Instead ' + highscore + ')'
      highscore = +highscoreNumber;
      localStorage.setItem('highscore', highscoreNumber)
    }
  }
  this.getHighscore = function() {
    return highscore;
  }
  this.showHighscore = function() {
    document.querySelector("#game-highscore h4").textContent = "Highscore: " + highscore;
  }
};

//конструктор объекта поп-апов
function Popups() {
  //закрывает все поп-апы и их обертку
  this.close = function(e) {
    //если в функцию передан эвент
    if (e) {
      //и у него есть класс popup-close, то был нажат крестик в окне поп-апа
      if (e.target.classList.contains('popup-close')) {
        //в таком случае закрываются все поп-апы
        this.close();
      }
      //если эвент передан не был, то функция вызвана из кода
    } else {
      //все открытые всплывающие окна записываются в переменную
      var popups = document.querySelectorAll(".popup-visible");
      //и каждое из них
      popups.forEach(function(item) {
        //получает CSS свойства, прячущие слой
        item.style.visibility = 'hidden';
        item.classList.remove('popup-visible');
      });
    }
  }
  //показывает поп-ап по выбранному селектору
  this.show = function(selector) {
    //сначала закрывает все остальные всплывающие окна
    this.close();
    //переменная получает в себя элемент, выбранный по селектору
    var popup = document.querySelector(selector);
    //если переменная ошибочка
    if (!popup) {
      console.log('Неверный id всплывающего окна!');
      return;
    }
    //отображает обязательную обложку всплывающего окна
    document.querySelector("#popup-wrapper").style.visibility = 'visible';
    document.querySelector("#popup-wrapper").classList.add('popup-visible');
    //и отображает выбранный поп-ап
    popup.style.visibility = 'visible';
    popup.classList.add('popup-visible');
    //добавляет поп-апу листенер на клик, который вызывает проверку на необходимость закрытия окна
    popup.addEventListener('click', this.close.bind(this));
  }
}

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

//главный листенер клавиатуры
document.addEventListener('keydown', function(e) {
  //вызывает функцию только тогда, когда идет игра
  if (ingameInfo.playing === true) {
    keydownOnPepe(+e.key);
  }
  //нажатие R начинает новую игру
  if (e.code == 'KeyR') {
    if (ingameInfo.playing) gameOver(false);
    play();
  }
  //нажатие P прерывает текущую игру, если она запущена
  if (e.ctrlKey && e.code == 'KeyX') {
    popups.close();
  }
  if (e.code == 'KeyP' && ingameInfo.playing) {
    //вызов функции окончания игры без показа всплывающего окна и учета highscore
    gameOver(false, false);
    stats.setTimeLeft(0);
    headerButtonsSwitcher('stop');
  }
});

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

//обработка клика по активной клетке
function clickOnPepe(gameBlock) {
  if (gameBlock.classList.contains('game-block__active')) {
    //клетка перестает быть активной
    gameBlock.classList.remove('game-block__active', 'pepe-standard');
    scorer();
    //отображается новый Пепе
    showPepe();
  }
};

//фукнция получает в себя начало('start') или конец('stop') игры, в зависимости от этого меняет "объем" кнопок в header
function headerButtonsSwitcher(gameStatus) {
  if (gameStatus === 'start') {
    //кнопка "PLAY" теряет объем
    document.querySelector('#play').classList.remove('button-clickable');
    //зато его получают кнопки "REPLAY" & "BREAK"
    document.querySelector('#replay').classList.add('button-clickable');
    document.querySelector("#break").classList.add('button-clickable');
  }
  else if (gameStatus === 'stop') {
    //кнопка "PLAY" получает объем
    document.querySelector('#play').classList.add('button-clickable');
    //зато его теряют кнопки "REPLAY" & "BREAK"
    document.querySelector('#replay').classList.remove('button-clickable');
    document.querySelector("#break").classList.remove('button-clickable');
  }
  else {
    console.log('Неверный параметр передан в функцию');
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

//сбрасывает все setInterval's в объекте timers, хранящем таймера
function clearTimers() {
  for (var timer in timers) {
    clearInterval(timers[timer]);
  };
}

function play() {
  //если игра идет в данный момент, то прерывается выполнение функции
  if (ingameInfo.playing) return
  //предварительно закрываются все поп-апы
  popups.close();
  //обновляется переменная настроек из инпутов
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
  headerButtonsSwitcher('start');
  //игровой таймер
  timers.clasicTimer = setInterval(function() {
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
      clearTimers();
      //заканчивается игра
      gameOver();
      //в конце игры звучит гудок
      sounds.timeEnd.play();
    }
  }, 1000)
}
//функция окончания игры, принимает:
// showPopup = true/false для показа всплывающего окна, по умолчанию true
// setHighscore = true/false для учета очков в highscore, по умолчанию true
function gameOver(showPopup = true, setHighscore = true) {
  clearTimers();
  //удаляется листенер с клика
  document.querySelector('.pepe-standard').removeEventListener('mousedown', clickOnPepe);
  //удаляется активная клетка
  document.querySelector('.pepe-standard').classList.remove('game-block__active', 'pepe-standard');
  //переменная, отвечающая за состояние игры
  ingameInfo.playing = false;
  //устанавливается highscore
  if(setHighscore) stats.setHighscore(stats.getScore());
  //обновляется вся статистика
  showStats();
  //если в функцию явно не передан запрет на показ всплывающего окна - оно показывается
  if(showPopup) popups.show("#popup-gameover");
  headerButtonsSwitcher('stop');
}
//запуск игры
btnPlay.addEventListener('click', play);

//листенер на клик по информационным кнопкам для вызова всплывающих окон
document.querySelector("#info-buttons").addEventListener('click', function(e) {
  switch (e.target.id) {
    case 'controls-info':
      popups.show("#popup-controls");
      break;
    case 'help-info':
      popups.show("#popup-help");
      break;
    case 'version-info':
      popups.show("#popup-version");
      break;
    case 'contacts-info':
      popups.show('#popup-contacts');
      break;
    default:
      return;
  }
});

//листенер для кнопки BREAK, прерывает игру без зачисления highscore и вызова popup'а
document.querySelector("#break").addEventListener('click', function() {
  //если игра не запущена - выход из функции, т.к прерывать нечего
  if (!ingameInfo.playing) return
  //вызов функции окончания игры без показа всплывающего окна и учета highscore
  gameOver(false, false);
  stats.setTimeLeft(0);
  headerButtonsSwitcher('stop');
});

//листенер для кнопки REPLAY, начинает новую игру в том случае, если игра уже идет
document.querySelector("#replay").addEventListener('click', function() {
  //если игра уже запущена - нажимать PLAY, выход из функции
  if (!ingameInfo.playing) return
  gameOver(false);
  play();
});
