'use strict';

const btnRoll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');
const btnNew = document.querySelector('.btn--new');
const diceImage = document.querySelector('.dice');
const main = document.querySelector('main');
const buttonsPlayersWrapper = document.querySelector('.buttons-players');
const buttonsPlayers = buttonsPlayersWrapper.querySelectorAll('.btn');

let scorers,
    currentScore,
    activePlayer,
    numberOfPlayers,
    btnEditName,
    btnSaveName;
let customScorers = [0, 0];

const removeActiveClass = function() {
    buttonsPlayers.forEach((button) => {
        button.classList.remove('active');
    })
}

const onChangeNumberOfPlayers = function(e) {
    const target = e.target;
    const targetPlayer = e.target.dataset.player;

    switch(targetPlayer) {
        case '2':
            removeActiveClass();
            target.classList.add('active');
            customScorers = [0, 0];
            init(customScorers);
            break;
        case '3':
            removeActiveClass();
            target.classList.add('active');
            customScorers = [0, 0, 0];
            init(customScorers);
            break;
        case '4':
            removeActiveClass();
            target.classList.add('active');
            customScorers = [0, 0, 0, 0];
            init(customScorers);
            break;
        default:
            removeActiveClass();
            target.classList.add('active');
            customScorers = [0, 0];
            init(customScorers);
    }
}

const onSaveNameByEnter = function(e) {
    if (e.key === 'Enter') {
        saveName();
    }
}

const editName = function(e) {
    const buttonEdit = e.target;
    const buttonSave = buttonEdit.parentElement.querySelector('.save-name');
    const inputEl = buttonEdit.parentElement.querySelector('.name');

    buttonEdit.classList.toggle('hidden');
    buttonSave.classList.toggle('hidden');
    inputEl.removeAttribute('readonly');
    inputEl.classList.add('edit-active');
    inputEl.value = '';
    inputEl.focus();

    document.addEventListener('keydown', onSaveNameByEnter);
}

const saveName = function() {
    const inputEl = document.querySelector('.name.edit-active');
    const buttonSave = inputEl.parentElement.querySelector('.save-name');
    const buttonEdit = buttonSave.parentElement.querySelector('.edit-name');

    buttonEdit.classList.toggle('hidden');
    buttonSave.classList.toggle('hidden');
    inputEl.setAttribute('readonly', '');
    inputEl.classList.remove('edit-active');

    document.removeEventListener('keydown', onSaveNameByEnter);
}

const assignEditNameEvent = function() {
    btnEditName = document.querySelectorAll('.edit-name');
    btnSaveName = document.querySelectorAll('.save-name');
    for (let i = 0; i < numberOfPlayers; i++) {
        btnEditName[i].addEventListener('click', editName);
        btnSaveName[i].addEventListener('click', saveName);
    }
}

const setMainClass = function() {
    if (numberOfPlayers > 2) {
        main.classList.add('more-2');
    } else {
        main.classList.remove('more-2');
    }
}

const createSection = function(arr) {
    const players = document.querySelector('.players');
    const tmpl = document.querySelector('#tmpl');
    const sectionListFragment = document.createDocumentFragment();

    for (let i = 0; i < numberOfPlayers; i++) {
        const playerSection = tmpl.content.querySelector('.player').cloneNode(true);

        const playerName = playerSection.querySelector('.name');
        const playerScore = playerSection.querySelector('.score');
        const playerCurrentScore = playerSection.querySelector('.current-score');

        const playerClassList = i === 0 ? [`player--${i}`, 'player--active'] : [`player--${i}`];

        playerSection.classList.remove(playerSection.classList[1]);
        playerSection.classList.add(...playerClassList);
        playerName.setAttribute('id', `name--${i}`);
        playerName.setAttribute('value', `Player-${i + 1}`);
        playerScore.setAttribute('id', `score--${i}`);
        playerCurrentScore.setAttribute('id', `current--${i}`);

        sectionListFragment.appendChild(playerSection);
    }

    players.innerHTML = '';
    players.append(sectionListFragment);
}

const resetFields = function(arr) {
    for (let i = 0; i < numberOfPlayers; i++) {
        document.getElementById(`score--${i}`).textContent = 0;
        document.getElementById(`current--${i}`).textContent = 0;
    }
}

const init = function(customScorers) {
    // scorers = [0, 0];
    scorers = customScorers;
    currentScore = 0;
    activePlayer = 0;
    numberOfPlayers = scorers.length;

    setMainClass();
    createSection(scorers);
    resetFields(scorers);
    diceImage.classList.add('hidden');
    assignEditNameEvent();
}

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

    activePlayer = activePlayer === numberOfPlayers - 1 ? 0 : activePlayer + 1;

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
    
    if (scorers[activePlayer] >= 100) {
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

    init(customScorers);
    enableButtons();
}

btnRoll.addEventListener('click', rollDice);
btnHold.addEventListener('click', holdScore);
btnNew.addEventListener('click', resetGame);
buttonsPlayersWrapper.addEventListener('click', onChangeNumberOfPlayers);

init(customScorers);