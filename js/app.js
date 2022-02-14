/*-------------------------------- Constants --------------------------------*/

const columns = 15;
const rows = 15;

/*---------------------------- Variables (state) ----------------------------*/

let snake, direction, snakeStart, winner, food, score;

/*------------------------ Cached Element References ------------------------*/

const board = document.querySelector('#board');
const startButton = document.querySelector('#start');
const message = document.querySelector('#message');

/*----------------------------- Event Listeners -----------------------------*/

document.querySelector('#snake-control').addEventListener('click', handleTurnButtons);
document.addEventListener('keydown', handleTurnKeys);
startButton.addEventListener('click', gameStart);



/*-------------------------------- Functions --------------------------------*/

let boardCells = boardGenerator(columns, rows);

init();


function init() {
  snake = [75, 76, 77];
  direction = 'right';
  foodGenerator();
  score = 0;
  winner = 1;
  render();
}


function render() {
  if (winner) {
    boardCells.forEach(cell => {
      if (cell.classList.contains('snake-body')) {
      cell.classList.remove('snake-body');
    }
  })

  snake.forEach(part => {
    if (boardCells[part].classList.contains('food-cell')) {
      boardCells[part].classList.remove('food-cell');
    }
    boardCells[part].classList.add('snake-body');
  })

  boardCells[food].classList.add('food-cell');
  document.querySelector('#score').textContent = `Score: ${score}`;
} else {
  clearInterval(snakeStart);
  message.textContent = 'You lost!'
}
}

function boardGenerator(columns, rows) {
  board.style.gridTemplateRows = `repeat(${rows},5vmin)`;
  board.style.gridTemplateColumns = `repeat(${columns},5vmin)`;
  for (let i = 0; i < (columns*rows); i++) {
    let cell = document.createElement('div');
    cell.setAttribute('class', 'board-cell');
    board.appendChild(cell);
  }
  return document.querySelectorAll('.board-cell');
}

function gameStart() {
  snakeStart = setInterval(move, 500);
}

function move() {
  winner = 1;
  let snakeHead = snake[snake.length-1];
  let newCell;
  switch (direction) {
  case 'right':   
    if (snakeHead%columns === 14) {
        winner = 0;
        break;
      } else {
          newCell = snakeHead + 1;
          break;
      }
  case 'left':
    if (snakeHead%columns === 0) {
        winner = 0;
        break;
      } else {
          newCell = snakeHead - 1;
          break;
      }
  case 'up':
    if (snakeHead < columns) {
        winner = 0;
        break;
      } else {
          newCell = snakeHead - columns;
          break;
      }
  case 'down':
    if (snakeHead >= columns*(rows-1)) {
        winner = 0;
        break;
      } else {
          newCell = snakeHead + columns;
          break;
      }
    }
  
  if(winner) {
    addMove(newCell);
  }
  render();
}

function addMove(newCell) {
  if (newCell === food) {
    snake.push(newCell);
    foodGenerator();
    winner = 2;
    score += 10;
  } else {
    snake.push(newCell);
    snake.shift();
  }
}

function handleTurnButtons(evt) {
  if (!winner) {
    return;
  }
  if ((evt.target.id === 'left' && direction !== 'right') || (evt.target.id === 'up' && direction !== 'down') || (evt.target.id === 'down' && direction !== 'up') || (evt.target.id === 'right' && direction !== 'left')) {
    direction = evt.target.id;
    move();
  }
}

function handleTurnKeys(evt) {
  if (!winner) {
    return;
  }
  if (evt.code.toLowerCase() === 'arrowleft' && direction !== 'right') {
  direction = 'left';
  move();
  } else if (evt.code.toLowerCase() === 'arrowup' && direction !== 'down') {
  direction = 'up';
  move();
  } else if(evt.code.toLowerCase() === 'arrowdown' && direction !== 'up') {
  direction = 'down';
  move();
  } else if (evt.code.toLowerCase() === 'arrowright' && direction !== 'left') {
  direction = 'right';
  move();
  }
}

function foodGenerator() {
  do {
    food = Math.floor(Math.random() * 225);
  }
  while (snake.includes(food));
}