(function() {

  //creating basic game variables:
  var availableChoices = document.querySelectorAll("[data-key]");

  var header = document.querySelector(".level-display");

  var level = null;

  var combination = null;

  var playerChoices = null;

  var choiceCounter = 0;

  //creating function adding random button to the combination:
  function addToCombination() {
    combination.push(availableChoices[Math.floor(Math.random() * availableChoices.length)].getAttribute("data-key"));
  }


  //creating function playing appropriate sound when button pressed
  function playSound(key) {
    var sound = new Audio("sounds/" + key + ".wav");

    sound.play();
  }


  //creating function responsible for styling changes upon button press:
  function buttonStyleChange(button) {
    button.classList.add("pressed");

    setTimeout(function() {button.classList.remove("pressed")}, 200);
  }


  //creating function cleansing unnecessary event listeners:
  function purgeEventListeners() {
    document.removeEventListener("mousedown", buttonClickedEvent);
    document.removeEventListener("keydown", keyPressedEvent);
  }


  //creating function responsible for logic upon button being pressed:
  function runButtonLogic(key, button) {
    playSound(key);

    buttonStyleChange(button);

    playerChoices.push(key);

    choiceCounter += 1;

    //creating condition for when the player's choice is not in line with the
    //respective position in the combination:
    if (playerChoices[choiceCounter - 1] != combination[choiceCounter - 1]) {
      purgeEventListeners();

      //gameover logic goes here:
      return gameOver();
    }
    //creating condition for when player made as many choices as there are
    //possibilities in the combination and so advances a level:
    if (choiceCounter == level) {
      purgeEventListeners();

      //new level set up:
      setTimeout(setUpLevel, 700);
    }
  }


  //creating function setting everything up for new game
  function newGame() {
    level = 0;

    combination = [];

    header.textContent = "Press any key to continue";

    document.addEventListener("keydown", function() {
      setUpLevel();
    }, {once: true});
  }


  //creating function responsible for game over event:
  function gameOver() {
    purgeEventListeners();

    var background = document.querySelector("body");

    background.classList.add("game-over");

    setTimeout(function() {background.classList.remove("game-over"), 500});    

    header.textContent = "Game over, press ENTER to restart";

    document.addEventListener("keydown", function(event) {
      if (event.key == "Enter") {
        newGame();
      }
    });
  }

  //creating function responsible for what happens when button is clicked
  function buttonClickedEvent(eventObject) {
    if (eventObject.target.hasAttribute("data-key")) {

      var buttonPressed = eventObject.target;

      var keyPressed = eventObject.target.getAttribute("data-key");

      runButtonLogic(keyPressed, buttonPressed);
    }
  }


  //creating function responsible for what happens when key is pressed:
  function keyPressedEvent(eventObject) {
    var buttonPressed = document.querySelector(`[data-key="${eventObject.key}"]`)

    if (buttonPressed) {
      var keyPressed = buttonPressed.getAttribute("data-key");

      runButtonLogic(keyPressed, buttonPressed);
    }
  }


  //creating function for what needs to happen after first keypress is done:
  function setUpLevel() {
    playerChoices = [];

    addToCombination();

    choiceCounter = 0;

    level += 1;

    var lastElement = combination[combination.length - 1];

    var lastElementButton = document.querySelector(`[data-key="${lastElement}"]`);

    playSound(lastElement);

    buttonStyleChange(lastElementButton);

    header.textContent = "Level " + level;

    document.addEventListener("mousedown", buttonClickedEvent);

    document.addEventListener("keydown", keyPressedEvent);
  }

  newGame();
})();
