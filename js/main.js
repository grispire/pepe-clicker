"use strict"
document.addEventListener("DOMContentLoaded", function() {
  var game = {
    score: 0,
    timeLeft: 120,
    playing: true
  };
  var DOM = {
    score: document.getElementById("score"),
    timeLeft: document.getElementById('timeleft'),
    poputText: document.getElementById('popup-text'),
    cellsCollection: document.querySelectorAll(".pepe"),
    popups: document.querySelectorAll(".popups")
  }
  var timeLeft = 120;

  //начало игры
  showPepe();

  var timer = setInterval(function() {
    game.timeLeft -= 1;
    if (game.timeLeft == 0) {
      //закончить игру
      game.playing = false;
      clearInterval(timer);
      DOM.cellsCollection.forEach(function(cell) {
        cell.style.backgroundColor = "grey";
      })
      showPepe();
    }
    DOM.timeLeft.textContent = "Time left: " + game.timeLeft;
  }, 1000);

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
    //если игра закончилась
    if (!game.playing) {
      pepeActive[0].removeEventListener("click", addScore);
      pepeActive[0].classList.remove("pepe-active");
      return
    }
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
    popup.style.top = event.clientY + -30 +"px";
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
