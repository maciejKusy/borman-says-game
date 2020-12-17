(function() {

  //creating the logic for adding onto the combination + starting combination
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


  //creating function responsible for logic upon button being pressed:
  function runButtonLogic(key, button) {
    playSound(key);

    buttonStyleChange(button);

    playerChoices.push(key);

    choiceCounter += 1;

    console.log(playerChoices);
    console.log(combination)
    //creating condition for when the player's choice is not in line with the
    //respective position in the combination:
    if (playerChoices[choiceCounter - 1] != combination[choiceCounter - 1]) {
      document.removeEventListener("mousedown", buttonClickedEvent);
      document.removeEventListener("keydown", keyPressedEvent);

      //gameover logic goes here:
      newGame();
    }
    //creating condition for when player made as many choices as there are
    //possibilities in the combination and so what level they are on:
    if (choiceCounter == level) {
      document.removeEventListener("mousedown", buttonClickedEvent);
      document.removeEventListener("keydown", keyPressedEvent);

      //new level set up:
      setUpLevel();
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
