/*Представление*/

let view = {
    displayMessage: function (msg) {
        let messageArea = document.getElementById('messageArea');
        messageArea.innerHTML = msg;
    },
    displayHit: function (location) {
        let cell = document.getElementById(location);
        cell.classList.add('hit');
    },
    displayMiss: function (location) {
        let cell = document.getElementById(location);
        cell.classList.add('miss');
    }
};

/*Модель поведения игры*/

let model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0,
    ships: [
        ship1 = {location: ['00', '00', '00'], hits: ['', '', '']},
        ship2 = {location: ['00', '00', '00'], hits: ['', '', '']},
        ship3 = {location: ['00', '00', '00'], hits: ['', '', '']}
    ],
    fire: function (guess) {
        for(let i=0; i < this.numShips; i++){
            let ship = this.ships[i];
            let index = ship.location.indexOf(guess);
            if (index !== -1) {
                ship.hits[index] = 'hit';
                view.displayHit(guess);
                view.displayMessage('Попадание!!!');
                if (this.isSunk(ship)) {
                    view.displayMessage('Корабль потоплен!!');
                    this.shipsSunk++;
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage('Промах((');
        return false;
    },
    isSunk: function (ship) {
        for (let i = 0; i < this.shipLength; i++) {
            if (ship.hits[i] !== 'hit') {
                return false;
            }
        }
        return true;
    },
    generateShipLocation: function () {
        let location;
        for (let i = 0; i < this.numShips; i++) {
            do {
                location = this.generateShip();
            }while (this.collision(location));
            this.ships[i].location = location;
        }
    },
    generateShip: function () {
        let direction = Math.floor(Math.random() * 2);
        let row, col;
        if (direction === 1) {
            /*Генерация для горизонтального корабля*/
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
        }else {
            /*Генерация для вертикального корабля*/
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
            col = Math.floor(Math.random() * this.boardSize);
        }
        let newShipLocation = [];
        for(let i = 0; i < this.shipLength; i++) {
            if (direction === 1) {
                /*Добавить в массив для горизонтального корабля*/
                newShipLocation.push(row + '' + (col+i));
            }else {
                /*Добавить в массив для вертикального корабля*/
                newShipLocation.push((row + i) + '' + col);
            }
        }
        return newShipLocation;
    },
    collision: function (location) {
        for (let i = 0; i < this.shipLength; i++) {
            let ship = model.ships[i];
            for (let j = 0; j < location.length; j++) {
                if (ship.location.indexOf(location[j]) >= 0)
                return true;
            }
        }
        return false;
    }
};

/*Взаимодействие*/

let controller = {
    guesses: 0,
    processGuesses: function (guess) {
        let location = parceGuess(guess);
        if (location) {
            this.guesses++;
            let hit = model.fire(location);
            if (hit && model.shipsSunk === model.numShips) {
                view.displayMessage('Вы победили, сделав ' + this.guesses + ' выстрелов!!');
            }
        }
    }
};
function parceGuess (guess) {
    let alphabet = ['A','B','C','D','E','F','G'];
    if (guess === null || guess.length !== 2) {
        view.displayMessage('Вы ввели неверное значение')
    } else {
        let firstChar = guess.charAt(0);
        let row = alphabet.indexOf(firstChar);
        let column = guess.charAt(1);
        if (isNaN(row) || isNaN(column)) {
            view.displayMessage('Вы ввели неверное значение')
        } else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
            view.displayMessage('Вы ввели неверное значение')
        } else {
            return row + column;
        }
    }
    return null;
}
function init() {
    let fireButton = document.getElementById('fireButton');
    fireButton.onclick = handleFireButton;
    let guessInput = document.getElementById('guessInput');
    guessInput.onkeypress = handleKeyPress;
    model.generateShipLocation();
}
function handleFireButton() {
    let guessInput = document.getElementById('guessInput');
    let guess = guessInput.value;
    controller.processGuesses(guess);
    guessInput.value = '';
}
function handleKeyPress (e) {
    let fireButton = document.getElementById('fireButton');
    if (e.keyCode === 13) {
        fireButton.click();
        return false;
    }
}
window.onload = init;


/*controller.processGuesses('A1');
controller.processGuesses('A2');
controller.processGuesses('A3');
controller.processGuesses('B1');
controller.processGuesses('B2');
controller.processGuesses('B3');
controller.processGuesses('C1');
controller.processGuesses('C2');
controller.processGuesses('C3');*/

