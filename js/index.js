/**
 * Boro Says game, based on the popular Simon Says game, developed by
 * Maciej Kusy, December 2020. With each level the program will increment the
 * combination of keys the player needs to re-create by one button. */


/**
 * Enclosing the code within a IIFE in order to keep the global namespace clean
 */
(function() {

  /** Creating basic game variables */
  const availableChoices = document.querySelectorAll("[data-key]");

  const header = document.querySelector(".level-display");

  let level = null;

  let combination = null;

  let playerChoices = null;

  let choiceCounter = 0;

  /** Adds random button to the combination end of the combination array */
  const addToCombination = () => {
    let randomIndex = Math.floor(Math.random() * availableChoices.length);

    combination.push(availableChoices[randomIndex].getAttribute("data-key"));
  }


  /** Plays relevant sound when a button is pressed
   * @param {string} key - the key/button that was pressed
   */
  const playSound = key => {
    let sound = new Audio("sounds/" + key + ".wav");

    sound.play();
  }


  /** Creates an illusion of a 'blinking' style change for a selected object
   * @param {Object} object - The DOM element that will 'blink'
   * @param {string} className - The class to be applied for the duration of the blink
   * @param {timeoutDuration} - the duration of the blink
   */
  const blinkingStyleChange = (object, className, timeoutDuration) => {
    object.classList.add(className);

    setTimeout(function() {object.classList.remove(className)}, timeoutDuration);
  }


  /** Purges event listeners from previous 'level' */
  const purgeEventListeners = () => {
    document.removeEventListener("mousedown", buttonClickedEvent);
    document.removeEventListener("keydown", keyPressedEvent);
  }


  /** Handling logic upon button being pressed
   * @param {string} key - the key that corresponds to the button that was clicked
   * @param {Object} button - the button object that is the target of the event
   */
  const runButtonLogic = (key, button) => {
    playSound(key);

    blinkingStyleChange(button, "pressed", 200);

    playerChoices.push(key);

    /** Setting condition for when the player's choice is not in line with the
     * respective position in the combination */
    if (playerChoices[choiceCounter] != combination[choiceCounter]) {
      purgeEventListeners();

      return gameOver();
    }

    choiceCounter += 1;

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
  const newGame = () => {
    level = 0;

    combination = [];

    header.textContent = "Press any key to continue";

    document.addEventListener("keydown", function() {
      setTimeout(setUpLevel, 500);
    }, {once: true});
  }


  /** Setting up new game after game lost */
  const restart = eventObject => {
    if (eventObject.key == "Enter") {
      document.removeEventListener("keydown", restart);

      newGame();
    }
  }


  /** Ending current game bu purging event listeners, giving the player a visual
   * cue, updating the header text and setting up 'restart' event listener */
  const gameOver = () => {
    purgeEventListeners();

    const background = document.querySelector("body");

    blinkingStyleChange(background, "game-over", 300);

    header.textContent = "Game over, press ENTER to restart";

    document.addEventListener("keydown", restart);
  }


  /** Handling 'mousedown' events
   * @param {Object} eventObject - the 'mousedown' event that occurs
   */
  const buttonClickedEvent = eventObject => {
    if (eventObject.target.hasAttribute("data-key")) {

      let buttonPressed = eventObject.target;

      let keyPressed = eventObject.target.getAttribute("data-key");

      runButtonLogic(keyPressed, buttonPressed);
    }
  }


  /** Handling 'keydown' events
   * @param {Object} eventObject - the 'keydown' event that occurs
   */
  const keyPressedEvent = eventObject => {
    let buttonPressed = document.querySelector(`[data-key="${eventObject.key}"]`)

    if (buttonPressed) {
      let keyPressed = buttonPressed.getAttribute("data-key");

      runButtonLogic(keyPressed, buttonPressed);
    }
  }


  /** Sets up new level after a combination was entered by the player correctly
   */
  const setUpLevel = () => {
    playerChoices = [];

    addToCombination();

    choiceCounter = 0;

    level += 1;

    let lastElement = combination[combination.length - 1];

    let lastElementButton = document.querySelector(`[data-key="${lastElement}"]`);

    playSound(lastElement);

    blinkingStyleChange(lastElementButton, "pressed", 200);

    header.textContent = "Level " + level;

    document.addEventListener("mousedown", buttonClickedEvent);

    document.addEventListener("keydown", keyPressedEvent);
  }

  newGame();
})();
