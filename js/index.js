/**
 * Boro Says game, based on the popular Simon Says game, developed by
 * Maciej Kusy, December 2020. With each level the program will increment the
 * combination of keys the player needs to re-create by one button. */


/**
 * Enclosing the code within a IIFE in order to keep the global namespace clean
 */
(function() {

  /** Creating basic game variables */
  var availableChoices = document.querySelectorAll("[data-key]");

  var header = document.querySelector(".level-display");

  var level = null;

  var combination = null;

  var playerChoices = null;

  var choiceCounter = 0;

  /** Adds random button to the combination end of the combination array */
  function addToCombination() {
    combination.push(availableChoices[Math.floor(Math.random() * availableChoices.length)].getAttribute("data-key"));
  }


  /** Plays relevant sound when a button is pressed
   * @param {string} key - the key/button that was pressed
   */
  function playSound(key) {
    var sound = new Audio("sounds/" + key + ".wav");

    sound.play();
  }


  /** Styles button when pressed and removes the styling in order to create an
   * illusion of the button actually being pressed
   * @param {string} button - the button that was pressed and is to be styled */
  function buttonStyleChange(button) {
    button.classList.add("pressed");

    setTimeout(function() {button.classList.remove("pressed")}, 200);
  }


  /** Purges event listeners from previous 'level' */
  function purgeEventListeners() {
    document.removeEventListener("mousedown", buttonClickedEvent);
    document.removeEventListener("keydown", keyPressedEvent);
  }


  /** Handling logic upon button being pressed
   * @param {string} key - the key that corresponds to the button that was clicked
   * @param {Object} button - the button object that is the target of the event
   */
  function runButtonLogic(key, button) {
    playSound(key);

    buttonStyleChange(button);

    playerChoices.push(key);

    choiceCounter += 1;

    /** Setting condition for when the player's choice is not in line with the
     * respective position in the combination */
    if (playerChoices[choiceCounter - 1] != combination[choiceCounter - 1]) {
      purgeEventListeners();

      return gameOver();
    }
    /** Setting condition for when player made as many choices as there are
     * possibilities in the combination without an error and so advances a level
     */
    if (choiceCounter == level) {
      purgeEventListeners();

      setTimeout(setUpLevel, 700);
    }
  }


  /** Setting up a new game bu re-setting the level and the combination,
   * refreshing the header text and adding the first event listener */
  function newGame() {
    level = 0;

    combination = [];

    header.textContent = "Press any key to continue";

    document.addEventListener("keydown", function() {
      setUpLevel();
    }, {once: true});
  }


  /** Setting up new game after game lost */
  function restart(eventObject) {
    if (eventObject.key == "Enter") {
      document.removeEventListener("keydown", restart);

      newGame();
    }
  }


  /** Ending current game bu purging event listeners, giving the player a visual
   * cue, updating the header text and setting up 'restart' event listener */
  function gameOver() {
    purgeEventListeners();

    var background = document.querySelector("body");

    background.classList.add("game-over");

    setTimeout(function() {background.classList.remove("game-over"), 500});

    header.textContent = "Game over, press ENTER to restart";

    document.addEventListener("keydown", restart);
  }


  /** Handling 'mousedown' events
   * @param {Object} eventObject - the 'mousedown' event that occurs
   */
  function buttonClickedEvent(eventObject) {
    if (eventObject.target.hasAttribute("data-key")) {

      var buttonPressed = eventObject.target;

      var keyPressed = eventObject.target.getAttribute("data-key");

      runButtonLogic(keyPressed, buttonPressed);
    }
  }


  /** Handling 'keydown' events
   * @param {Object} eventObject - the 'keydown' event that occurs
   */
  function keyPressedEvent(eventObject) {
    var buttonPressed = document.querySelector(`[data-key="${eventObject.key}"]`)

    if (buttonPressed) {
      var keyPressed = buttonPressed.getAttribute("data-key");

      runButtonLogic(keyPressed, buttonPressed);
    }
  }


  /** Sets up new level after a combination was entered by the player correctly
   */
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
