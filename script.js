var originalBoard;
const humanPlayer = 'O';
const aiPlayer = 'X';
const winningCombs = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];

const cells = document.querySelectorAll('.cell');

startGame();

function startGame() {
    document.querySelector('.endgame').style.display = 'none';
    originalBoard = Array.from(Array(9).keys());

    for(var i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
    }
}

function turnClick(e) {
    if(typeof originalBoard[e.target.id] === 'number') {
        turn(e.target.id, humanPlayer);
        if (!checkTie()) {
            turn(bestSpot(), aiPlayer);
        } else {
            declareWinner('Tie Game');
        }
    }
}

function bestSpot() {
    return emptySquares()[0];
}

function emptySquares() {
    return originalBoard.filter(s => typeof s === 'number');
}

function declareWinner(who) {
    document.querySelector('.endgame').style.display = 'block';
    document.querySelector('.endgame .text').innerText = who;
}

function checkTie() {
    if(emptySquares().length === 0) {
        for (var i = 0; i < cells.length; i++) {
            cells[i].style.backgroundColor = 'green';
            cells[i].removeEventListener('click', turnClick, false);
        }
        return true;
    }
    return false;
}

function turn(squareId, player) {
    originalBoard[squareId] = player; // set state of originalBoard
    document.getElementById(squareId).innerText = player; // update board template
    let gameWon = checkWin(originalBoard, player); // check if anyone won the game
    if (gameWon) { // if gameWon, do formalities for game over and declare winner
        gameOver(gameWon);
        declareWinner(gameWon.player === humanPlayer ? 'You Win!' : 'You Loose');
    }
}

function checkWin(board, player) {
    let plays = board.reduce((a, e, i) => (e === player) ? a.concat(i) : a, []);

    let gameWon = null;
    for(let [index, win] of winningCombs.entries()) {
        if (win.every(element => plays.indexOf(element) > -1)){
            gameWon = { index, player };
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon) {
    for (let index of winningCombs[gameWon.index]) {
        document.getElementById(index).style.backgroundColor =
            gameWon.player === humanPlayer ? 'blue' : 'red';
    }

    for (var i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false);
    }
}
