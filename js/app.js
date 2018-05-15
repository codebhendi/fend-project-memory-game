"use strict";
window.onload = init;
window.value_card = "";
window.move_counter = 0;
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

function init() {
  $(".restart").click(function () {
    location.reload();
  });

  check_game_status();

  window.move_counter = 0;

  setInterval(change_value, 1000);
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

function addEvents(arrayCards) {
  for (var li of arrayCards) {
    li.addEventListener("click", function () {
      if ($(this).hasClass("open")) {
        return;
      }

      $(this).addClass("open show");

      if (window.value_card === "") {
        window.value_card = this.dataset.value;
      } else if (window.value_card !== this.dataset.value) {
        window.value_card = "";
        window.move_counter += 1;

        setTimeout(close_all, 800);
      } else {
        window.value_card = "";
        window.move_counter += 1;

        var li_match = $("ul").find("[data-value='" + this.dataset.value + "']");
        $(li_match).addClass("match");

        setTimeout(close_all, 500);
      }
    });
  }
}

function close_all() {
  $("li.card").removeClass("open show");
}

function change_value() {
  var moves_counter = $(".moves")[0];
  moves_counter.innerText = window.move_counter;
}

function check_game_status() {
  var card_match_count = $("li.card.match");
  if (card_match_count.length === 16) {
    window.alert("Yay, you have won. Your final score is " + window.move_counter + ".");
  } else {
    setTimeout(check_game_status, 1000);
  }
}
