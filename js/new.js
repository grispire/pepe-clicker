"use strict"
document.addEventListener("DOMContentLoaded", function() {
  var settings = {
    //получение режима игры из input[type="range"]
    gameTime: document.querySelector('#game-time__input').value,
    //получение режима игры из input[type="radio"]
    gameMode: document.querySelector('input[name="game-mode__input"]:checked').value,
    //получение режима игры из input[type="radio"]
    fieldSize: document.querySelector('input[name="game-field__input"]:checked').value,

  }
  //слежка за изменением настроек в блоке настроек
  document.querySelector("#game-settings").addEventListener("change", setSettings);

  //функция, изменяющая объект settings, отвечающий за настройки
  //сам игровой процесс изменится после запуска новой игры
  function setSettings(event) {
    //получено изменение размера поля, будет изменен размера поля
    if (event.target.name == 'game-field__input') setFieldSize(event.target.value);
    //получено изменение режима игры, будет изменен режим игры
    if (event.target.name == 'game-mode__input') setGameMode(event.target.value);
    //получено изменение времени, будет изменено время
    if (event.target.name == 'game-time__input') setGameTime(event.target.value);

    //функция установки игрового времени
    function setGameTime(value) {
      settings.gameTime = value;
    }

    //функция установки режима игры
    function setGameMode(value) {
      settings.gameMode = value;
    }

    //функция установки размера поля
    function setFieldSize(value) {
      settings.fieldSize = value;
    }
    console.log('Настройки изменены. Игровое время: ' + settings.gameTime + '; Игровой режим: ' + settings.gameMode + '; Размер поля: ' + settings.fieldSize);
  }

});
