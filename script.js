'use strict';

const btnRoll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');
const btnNew = document.querySelector('.btn--new');
const scoreField0 = document.getElementById('score--0');
const currentScoreField0 = document.getElementById('current--0');
const scoreField1 = document.getElementById('score--1');
const currentScoreField1 = document.getElementById('current--1');
const diceImage = document.querySelector('.dice');

let scorers, currentScore, activePlayer;

const init = function() {
    scorers = [0, 0];
    currentScore = 0;
    activePlayer = 0;

    currentScoreField0.textContent = 0;
    currentScoreField1.textContent = 0;
    scoreField0.textContent = 0;
    scoreField1.textContent = 0;

    diceImage.classList.add('hidden');
}

init();

const disableButtons = function() {
    btnRoll.setAttribute('disabled', '');
    btnHold.setAttribute('disabled', '');
}

const enableButtons = function() {
    btnRoll.removeAttribute('disabled');
    btnHold.removeAttribute('disabled');
}

const switchPlayer = function() {
    document.querySelector(`.player--${activePlayer}`).classList.remove('player--active');

    activePlayer = activePlayer === 0 ? 1 : 0;
    document.querySelector(`.player--${activePlayer}`).classList.add('player--active');
}

const rollDice = function() {
    const dice = Math.trunc(Math.random() * 6) + 1;

    diceImage.classList.remove('hidden');
    diceImage.src = `dice-${dice}.png`;

    if (dice !== 1) {
        currentScore += dice;
        document.getElementById(`current--${activePlayer}`).textContent = currentScore;
    } else {
        currentScore = 0;
        document.getElementById(`current--${activePlayer}`).textContent = '0';
        switchPlayer();
    }
}

const holdScore = function() {
    scorers[activePlayer] += currentScore;
    document.getElementById(`score--${activePlayer}`).textContent = scorers[activePlayer];
    currentScore = 0;
    
    if (scorers[activePlayer] >= 20) {
        diceImage.classList.add('hidden');
        disableButtons();
        document.querySelector(`.player--${activePlayer}`).classList.remove('player--active');
        document.querySelector(`.player--${activePlayer}`).classList.add('player--winner');
    } else {
        switchPlayer();
    }
}

const resetGame = function() {
    document.querySelector(`.player--${activePlayer}`).classList.remove('player--winner');
    document.querySelector(`.player--0`).classList.add('player--active');

    init();
    enableButtons();
}

btnRoll.addEventListener('click', rollDice);
btnHold.addEventListener('click', holdScore);
btnNew.addEventListener('click', resetGame);