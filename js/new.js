"use strict"
document.addEventListener("DOMContentLoaded", function() {
  var settings = {
    gameMode: 0,
    gameField: 0,
    gameTime: 0,
  }
  console.log(document.querySelectorAll('input[name="game-mode__input"]'));
  var test1 = document.querySelectorAll('input[name="game-mode__input"]')
  var test = document.getElementsByName("game-mode__input");
  console.log(typeof test1)
  console.log(typeof test);
  for (var i = 0; i < test.length; i++) {
    if (test[i].checked) {
      console.log(test[i].value);
    }
  }
});
