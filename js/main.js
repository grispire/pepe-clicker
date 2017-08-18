"use strict"
document.addEventListener("DOMContentLoaded", function() {
  var game = {
    score: 0,
    time: 2,
    timeLeft: 0,
    playing: false
  };

  var DOM = {
    score: document.getElementById("score"),
    timeLeft: document.getElementById('timeleft'),
    poputText: document.getElementById('popup-text'),
    cellsCollection: document.querySelectorAll(".pepe"),
    popups: document.querySelectorAll(".popups"),
    newGame: document.getElementById('newGame'),
  };

  DOM.timeLeft.textContent = "Time left: " + game.time;
  DOM.score.textContent = "Score: " + game.score;

  //клик на кнопку "новая игра"
  DOM.newGame.onclick = function() {
    //если на данный момент игра не запущена
    if (!game.playing) {
      //запустить игру
      play();
    }
    else {
      return;
    }
  }

  //начало игры
  function play() {
    //игра идет
    game.playing = true;
    //оставшееся время, которое будет изменяться таймером, равно времени на игру.
    game.timeLeft = game.time;

    DOM.timeLeft.textContent = "Time left: " + game.timeLeft;
    showPepe();
    DOM.cellsCollection.forEach(function(cell) {
      cell.style = "";
    })
    //таймер для игры
    var playTimer = setInterval(function() {
      //каждую секунду уменьшаем таймер на 1
      game.timeLeft -= 1;
      //если время вышло - игра заканчивается
      if (game.timeLeft == 0 || game.timeLeft < 0) {
        clearInterval(playTimer);
        gameOver();
      }
      DOM.timeLeft.textContent = "Time left: " + game.timeLeft;
    }, 1000);
  }

  function gameOver() {
    game.playing = false;
    var pepeActive = document.getElementsByClassName("pepe-active");
    pepeActive[0].removeEventListener("click", addScore);
    pepeActive[0].classList.remove("pepe-active");
    DOM.cellsCollection.forEach(function(cell) {
      cell.style.backgroundColor = "grey";
    })
  }


  //добавляет очки
  function addScore() {
    showPepe();
    game.score += 10;
    DOM.score.textContent = "Score: " + game.score;
    popupMessage("+10");
  }
  //отображает нового Пепе в сетке
  function showPepe() {
    //получаем отображаемого Пепе
    var pepeActive = document.getElementsByClassName("pepe-active");
    //если он есть, то удаляем его и очищаем листенер
    if (pepeActive[0]) {
      pepeActive[0].removeEventListener("click", addScore);
      pepeActive[0].classList.remove("pepe-active");
    }
    //рандомное число, отвечающее за положение Пепе
    var rnd = Math.floor(Math.random() * (DOM.cellsCollection.length));
    //присвоение класса с Пепе элементу
    DOM.cellsCollection[rnd].className += " pepe-active";
    //листенер на клик для начисления очков
    DOM.cellsCollection[rnd].addEventListener("click", addScore);
  }
  //создает и удаляет элемент <p> class="popup-text" с текстом message
  function popupMessage(message) {
    //создание элемента
    var popup = document.createElement('p');
    //присвоение класса
    popup.className = 'popup-text';
    //присвоение текста
    popup.textContent = message;
    //позиционирование элемента около курсора мыши
    popup.style.top = event.clientY + -30 + "px";
    popup.style.left = event.clientX + 30 + "px";
    //добавление элемента
    popups.appendChild(popup);
    //функция удаления элемента
    var timeout = window.setTimeout(elemRemove, 200, popup);
  }
  //удаляет переданный HTML-элемент
  function elemRemove(elem) {
    elem.remove()
  }
})
