"use strict";
window.onload = init;
var minutesLabel = document.getElementById("minutes");
var secondsLabel = document.getElementById("seconds");
var totalSeconds;
var interval;
var open_cards = [];
/*
 * Create a list that holds all of your cards
 */


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

/**
 * @description Init function, which starts eveything
 * also adds event for the  restart button.
 * @returns nothing
 */
function init() {
  startGame();
  $(".restart").click(function () {
    location.reload();
  });

}

/**
 * @description Starts the game by setting values for initial variables.
 * It shuffles all the card and then add the click event on all the cards.
 * We also start a timer which starts as soon as the game starts and ends
 * as soon as the game ends.
 * @return nothing
 */
function startGame() {
  totalSeconds = 0;
  window.value_card = "";
  window.move_counter = 0;
  window.move_counter = 0;
  interval = setInterval(setTime, 1000);

  var array_cards = $("li.card");

  var ul_deck = $("ul.deck")[0];
  while (ul_deck.firstChild) {
    ul_deck.removeChild(ul_deck.firstChild);
  }

  array_cards = shuffle(array_cards)
  for (var li of array_cards) {
    ul_deck.appendChild(li);
  }

  addEvents(array_cards);
}

/**
 * @description Adds click event to all cards which is sent by the calling function
 * We add the clicked card to an array then check if it is the only card. If not we
 * check if both cards are same this is done using the data-value attribute of each
 * card. If they are same we set them both as match and remove the class "open show".
 * We also empty out global array of open cards. If they are not same we will close
 * by removing the "open show" class and removing the cards from global array. We
 * also increase the number of moves if two different cards are clicked
 * consecutively. If same card is clicked nothing happens. When two cards are matched
 * we also check out if all the cards are matched. If all the cards are matched we
 * end the game. If matched cards are clicked again nothing happens.
 * @param arrayCards
 */
function addEvents(arrayCards) {
  for (var li of arrayCards) {
    li.addEventListener("click", function () {
      console.log(open_cards);
      if (this.classList.contains("match")) {
        return;
      }

      for (var card of open_cards) {
        if (this === card) {
          return;
        }
      }

      $(this).addClass("open show");
      open_cards.push(this);
      if (open_cards[0] === this) {
        return;
      }

      increaseScore();
      if (open_cards[0].dataset.value === open_cards[1].dataset.value) {
        for (var card of open_cards) {
           $(card).addClass("match");
           $(card).removeClass("open show");
        }
        open_cards = [];
        checkCardsMatched();
      } else {
        close_all();
      }
    });
  }
}

/**
 * @description closes all the cards present in the global array after
 * an interval of 0.5 seconds.
 */
function close_all() {
  setTimeout(function() {
    for (var card of open_cards) {
      $(card).removeClass("open show");
    }

    open_cards = [];
  }, 500);
}

/**
 * @description Increases score when it is called and shows the same on the
 * scoreboard. It also checks if score has reached a certain threshold after
 * which the stars are removed.
 */
function increaseScore() {
  var moves_counter = $(".moves")[0];
  window.move_counter += 1;
  moves_counter.innerText = window.move_counter;

  if (window.move_counter >= 14) {
    var stars = $("ul.stars li");
    if (stars.length === 3) {
      stars[0].remove();
    }
  }
  if (window.move_counter >= 20) {
    var stars = $("ul.stars li");
    if (stars.length == 2) {
      stars[0].remove();
    }
  }
}

/**
 * @description checks the cards that are matched and the count so that game can be ended.
 * If the game is ended we display a bootstrap modal and clear the interval increasing
 * the time. We display moves and time on the modal.
 */
function checkCardsMatched() {
  var card_match_count = $("li.card.match");
  if (card_match_count.length === 16) {
    clearInterval(interval);
    $("#score-modal")[0].innerText = window.move_counter;
    $("#minutes-modal")[0].innerText = pad(parseInt(totalSeconds / 60));
    $("#seconds-modal")[0].innerText = pad(totalSeconds % 60);
    $("#myModal").modal();
  }
}

/**
 * @description Increments time and display time passed in minutes and seconds
 */
function setTime() {
  ++totalSeconds;
  secondsLabel.innerHTML = pad(totalSeconds % 60);
  minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
}

/**
 * @description check if the string passed has length greater than or equal to 2.
 * If less then adds a zero at the beginning and returns the string.
 * @param val
 * @returns {string}
 */
function pad(val) {
  var valString = val + "";
  if (valString.length < 2) {
    return "0" + valString;
  } else {
    return valString;
  }
}
