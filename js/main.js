
"use strict"
//переменная настроек
var
  //игровое поле
  gameField = document.querySelector("#game-field"),
  //настройки
  settings = new Settings(),
  //игровое поле
  field = new Field(),
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
    //в runner-mode первый Пепе обязательно убежит
    cooldown: false
  },
  timers = {},
  btnPlay = document.querySelector("#play");
//конструктор объекта настроек
function Settings() {
  //получение времени из input[type="range"]
  var
    gameTime = +document.querySelector('#game-time__input').value,
    //получение режима игры из input[type="radio"]
    gameMode = document.querySelector('input[name="game-mode__input"]:checked').value;
  this.setGameTime = function(timeNumber) {
    gameTime = +document.querySelector('#game-time__input').value;
    stats.setTimeLeft(+document.querySelector('#game-time__input').value);
  }
  this.getGameTime = function() {
    return gameTime;
  }
  this.setGameMode = function(modeString) {
    gameMode = document.querySelector('input[name="game-mode__input"]:checked').value;
  }
  this.getGameMode = function() {
    return gameMode;
  }
  //принимает значение variation, которое отвечает за возвращаемый тип значения
  this.getDifficult = function(variation = 'string') {
    var difficult = document.querySelector('input[name="game-difficult__input"]:checked').value;
    //числа возвращаются в зависимости от размера поля
    if (variation === 'number') {
      switch (difficult) {
        case 'easy':
          return 9;
          break;
        case 'medium':
          return 16;
          break;
        case 'hard':
          return 25;
          break;
        default:
          alert('Problems with difficult. Got wrong value: ' + difficult);
          return
      }
    }
    if (variation == 'time') {
      switch (difficult) {
        case 'easy':
          return 500;
          break;
        case 'medium':
          return 350;
          break;
        case 'hard':
          return 200;
          break;
        default:
          alert('Problems with difficult. Got wrong value: ' + difficult);
          return
      }
    }
    // по умолчанию возвращается строка
    return difficult;
  }
  this.setAll = function() {
    this.setGameTime();
    this.setGameMode()
  }
};

//конструктор объекта статистики
function Stats() {
  var
    timeLeft = 0,
    score = 0,
    highscore = (localStorage.getItem('highscore')) ? +localStorage.getItem('highscore') : 0,
    docScore = document.querySelector("#game-score h4"),
    popupScore = document.querySelector("#gameover-score"),
    popupStopwatch = document.querySelector("#gameover-stopwatch"),
    stopwatch = 0;
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
  this.setStopwatch = function (time) {
    stopwatch = time;
  }
  this.getStopwatch = function () {
    return stopwatch;
  }
  this.showStopwatch = function () {
    document.querySelector("#game-timeLeft h4").textContent = "Time spent: " + stopwatch + 's';
    popupStopwatch.textContent = stopwatch;
  }
  this.showAll = function(mode) {
    this.showTimeLeft();
    this.showScore();
    this.showHighscore();
    //в runner показывается секундомер вместо оставшегося времени
    if (mode == 'runner') {
      this.showStopwatch()
    }
  }
  //если передана show, то отображается статистика
  this.default = function(show) {
    this.setTimeLeft(settings.getGameTime());
    this.setScore(0);
    if (show) this.showAll();
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
//ПЕРВИЧНЫЙ ВЫВОД ПОЛЯ И СТАТИСТИКИ
field.draw();
//Вывод статистики
stats.showAll();

//главный листенер клавиатуры
document.addEventListener('keydown', function(e) {
  //вызывает функцию только тогда, когда идет игра
  if (ingameInfo.playing === true) {
    keydownOnPepe(+e.key);
  }
  //нажатие R начинает новую игру
  if (e.code == 'KeyR') {
    console.log(ingameInfo);
    if (ingameInfo.playing) gameOver(false);
    play();
  }
  //нажатие P прерывает текущую игру, если она запущена
  if (e.ctrlKey && e.code == 'KeyX' || e.code == "Escape") {
    popups.close();
  }
  if (e.code == 'KeyP' && ingameInfo.playing) {
    //вызов функции окончания игры без показа всплывающего окна и учета highscore
    gameOver(false, false);
    stats.setTimeLeft(0);
    headerButtonsSwitcher('stop');
  }
});

function Field() {
  var
    //само игровое поле
    gameField = document.querySelector("#game-field"),
    //новая ячейка
    newCell = document.createElement('div');
  //отрисовка поля
  this.draw = function() {
    //режим берется из настроек
    var mode = settings.getGameMode();
    //полная очистка игрового поля
    this.clear();
    //отрисовка поля для классического режима
    if (mode === 'classic') {
      //присвоение ячейке поля класса
      newCell.className = 'game-block';
      //в зависимости от сложности меняется размер поля
      switch (settings.getDifficult('string')) {
        case 'easy':
          gameField.classList.add('field-classic__small');
          break;
        case 'medium':
          gameField.classList.add('field-classic__medium');
          break;
        case 'hard':
          gameField.classList.add('field-classic__large');
          break;
        default:
          console.log(settings.getDifficult('number'));
          console.log('Ошибка построения поля. Количество ячеек - ' + settings.getDifficult('number'))
      }
      //отрисовка поля
      for (var i = 0; i < settings.getDifficult('number'); i++) {
        gameField.appendChild(newCell.cloneNode());
      }
    }
    //отрисовка поля для runner режима
    if (mode === 'runner') {
      gameField.classList.add('field-runner');
    }
  }
  //очищает поле
  this.clear = function() {
    //убирает всех детей
    gameField.innerHTML = '';
    //удаляет все классы, кроме стандартного .game-field
    gameField.classList.forEach(function(i) {
      if (i == 'game-field') return
      gameField.classList.remove(i);
    })
  }
}


//функция отвечает за распределение очков
function scorer() {
  //в зависимости от сложности начисляются очки
  switch (settings.getDifficult('string')) {
    //10 очков на маленьком поле
    case 'easy':
      stats.addScore(10);
      break;
      //12 очков на среднем поле
    case 'medium':
      stats.addScore(12);
      break;
      //15 очков на большом поле
    case 'hard':
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
    //размер поля определяется сложностью
    fieldSize = settings.getDifficult('number'),
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
  } else if (gameStatus === 'stop') {
    //кнопка "PLAY" получает объем
    document.querySelector('#play').classList.add('button-clickable');
    //зато его теряют кнопки "REPLAY" & "BREAK"
    document.querySelector('#replay').classList.remove('button-clickable');
    document.querySelector("#break").classList.remove('button-clickable');
  } else {
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

function runnerPepeStart() {
    //секундомер сбрасывается
  stats.setStopwatch(0);
  stats.showStopwatch();
  //интервал для секундомера
  timers.stopwatch = setInterval(function () {
    //получает текущее время
    var currentTime = +stats.getStopwatch();
    //обрезает хвост
    currentTime = (currentTime+0.1).toFixed(1);
    stats.setStopwatch(+currentTime);
    stats.showStopwatch();
  }, 100)
  //кулдаун принудительно сбрасывается
  ingameInfo.cooldown = false;
  //игровое поле
  var
    gameField = document.querySelector("#game-field"),
    //блок с Пепе
    runningPepe = document.createElement('div');

  //ему присваивается нужный класс
  runningPepe.classList.add('pepe-runner');
  //блок добавляется на игровое поле
  gameField.appendChild(runningPepe);
  //вешается листенер на наведение
  document.querySelector(".pepe-runner").addEventListener('mouseover', pepeRun);
}

function pepeRun() {
  //получает время отката телепорта в зависимости от сложности
  var cooldownTime = settings.getDifficult('time');
  //если телепорт Пепе на кулдауне, то он не убежит
  if (ingameInfo.cooldown) {
    //и если по нему кликнуть в это время, то игра будет окончена
    document.querySelector(".pepe-runner").addEventListener('click', pepeCatched);
  }
  //если телепорт не на кулдауне
  if (!ingameInfo.cooldown) {
    //предыдущий таймер сброса кулдауна очищается
    clearTimeout(timers.resetCooldown);
    //устанавливается новый, который ведет отсчет от текущего момента
    timers.resetCooldown = setTimeout(function() {
      //по истечению времени он снова сбросит кулдаун
      ingameInfo.cooldown = false;
      //и сбросит себя на всякий случай
      clearTimeout(timers.resetCooldown);
    }, cooldownTime);
    //500 - ширина и высота игрового поля, 481 - чтобы картинка с лягушкой не вылезала за пределы поля
    document.querySelector(".pepe-runner").style.top = Math.random() * 481 + 'px';
    document.querySelector(".pepe-runner").style.left = Math.random() * 481 + 'px';
    //вешается кулдаун
    ingameInfo.cooldown = true;
  }
}

function pepeCatched() {
  document.querySelector(".pepe-runner").removeEventListener('click', pepeCatched);
  gameOver();
}
//сбрасывает все setInterval's в объекте timers, хранящем таймера
function clearTimers() {
  for (var timer in timers) {
    clearInterval(timers[timer]);
  };
}

function play() {
  //если игра идет в данный момент, то прерывается выполнение функции
  if (ingameInfo.playing) return;
  //предварительно закрываются все поп-апы
  popups.close();
  //обновляется переменная настроек из инпутов
  settings.setAll();
  //передает в объект информацию о текущем режиме
  ingameInfo.currentMode = settings.getGameMode();
  //устанавливает стандартные значения статистики и отображает их
  stats.default('show');
  //нарисовать игровое поле
  field.draw();
  //от режима игры зависит, что будет происходить во время игры
  var gameMode = settings.getGameMode();
  if (gameMode == 'classic') {
    //добавить первую активную клетку
    showPepe();
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
  //запуск runner
  if (gameMode == 'runner') {
    runnerPepeStart();
  }
  //игра начата
  ingameInfo.playing = true;
  //изменение объема кнопок
  headerButtonsSwitcher('start');

}
//функция окончания игры, принимает:
// showPopup = true/false для показа всплывающего окна, по умолчанию true
// setHighscore = true/false для учета очков в highscore, по умолчанию true
function gameOver(showPopup = true, setHighscore = true) {
  //получит информацию о последнем запущенном игровом режиме (который и нужно остановить)
  var gameMode = ingameInfo.currentMode;
  clearTimers();
  //окончание классического режима
  if (gameMode == 'classic') {
    //удаляется листенер с клика
    document.querySelector('.pepe-standard').removeEventListener('mousedown', clickOnPepe);
    //удаляется активная клетка
    document.querySelector('.pepe-standard').classList.remove('game-block__active', 'pepe-standard');
    //если в функцию явно не передан запрет на показ всплывающего окна - оно показывается
    if (showPopup) popups.show("#popup-gameover__classic");
  }
  if (gameMode == 'runner') {
    document.querySelector(".pepe-runner").removeEventListener('mouseover', pepeRun);
    document.querySelector(".pepe-runner").removeEventListener('click', pepeCatched);
    document.querySelector('.pepe-runner').classList.remove('pepe-runner');
    //если в функцию явно не передан запрет на показ всплывающего окна - оно показывается
    if (showPopup) popups.show("#popup-gameover__runner");
  }
  //переменная, отвечающая за состояние игры
  ingameInfo.playing = false;
  //устанавливается highscore
  if (setHighscore) stats.setHighscore(stats.getScore());
  //обновляется вся статистика
  stats.showAll(settings.getGameMode());
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
  //если игра не запущена - нажимать PLAY, выход из функции
  if (!ingameInfo.playing) return
  gameOver(false);
  play();
});
