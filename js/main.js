"use strict"
document.addEventListener("DOMContentLoaded", function() {
  var score = 0,
    timeLeft = 120,
    cellsCollection = document.querySelectorAll(".pepe"),
    scoreDOM = document.getElementById("score"),
    timeleftDOM = document.getElementById('timeleft'),
    playing = true;
  scoreDOM.textContent += score;
  timeleftDOM.textContent += timeLeft;
  showPepe();

  var timer = setInterval(function() {
    timeLeft -= 1;
    if (timeLeft == 0) {
      //закончить игру
      playing = false;
      clearInterval(timer);
      cellsCollection.forEach(function(cell) {
        cell.style.backgroundColor = "grey";
      })
      showPepe();
    }
    timeleftDOM.textContent = "Time left: " + timeLeft;
  }, 1000);

  function addScore() {
    showPepe();
    score += 10;
    scoreDOM.textContent = "Score: " + score;
  }
  //отображает нового Пепе в сетке
  function showPepe() {
    //получаем отображаемого Пепе
    var elem = document.getElementsByClassName("pepe-active");
    //если игра закончилась
    if (!playing) {
      elem[0].removeEventListener("click", addScore);
      elem[0].classList.remove("pepe-active");
      return
    }
    //если он есть, то удаляем его и очищаем листенер
    if (elem[0]) {
      elem[0].removeEventListener("click", addScore);
      elem[0].classList.remove("pepe-active");
    }
    //рандомное число, отвечающее за положение Пепе
    var rnd = Math.floor(Math.random() * (cellsCollection.length));
    //присвоение класса с Пепе элементу
    cellsCollection[rnd].className += " pepe-active";
    //листенер на клик для начисления очков
    cellsCollection[rnd].addEventListener("click", addScore);
  }
})
