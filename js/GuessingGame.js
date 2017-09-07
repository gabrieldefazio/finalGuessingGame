
var Game = function() {
    this.playersGuess = null;
    this.winningNumber = generateWinningNumber();
    this.pastGuesses = [];
    this.oneTime = 2;
}

function generateWinningNumber() {
    return Math.ceil(Math.random()*100);
}

const newGame = () => new Game();

Game.prototype.difference = function() {
    return Math.abs(this.playersGuess-this.winningNumber);
}

Game.prototype.isLower = function() {
    return this.playersGuess < this.winningNumber;
}

Game.prototype.playersGuessSubmission = function(guess) {
    console.log(guess)
    if( Number.isNaN(guess) || guess < 1 || guess > 100) {
        return "That is an invalid guess.";
    }
    this.playersGuess = guess;
    return this.checkGuess();
}

Game.prototype.checkGuess = function() {
    if(this.playersGuess===this.winningNumber) {
        $('#submit').attr('disabled', true);
        return 'You Win!'
    }
    else {
        if(this.pastGuesses.indexOf(this.playersGuess) > -1) {
            $('#subtitle').text('Try again!');
            return 'You have already guessed that number.';
        }
        else {
            console.log('hey')
            this.pastGuesses.push(this.playersGuess);
            $('#guess-list li:nth-child('+ this.pastGuesses.length +')').text(this.playersGuess);
            let diff = this.difference();
            if(this.pastGuesses.length === 5) {
                $('#submit').attr('disabled', true);
                $('#subtitle').text('Hit reset to try again!')
                return 'You Lose.';
            }
            else {
                if(diff < 10) return'You\'re burning up!';
                else if(diff < 25) return'You\'re lukewarm.';
                else if(diff < 50) return'You\'re a bit chilly.';
                else return'You\'re ice cold!';
            }
        }
    }
}

Game.prototype.provideHint = function(){
    this.oneTime--;
    let hint = [this.winningNumber];
    for (let i = 0; i < 2; i++) hint.push(generateWinningNumber())
    return shuffle(hint);
};


var shuffle = array =>{
    let last = array.length, current, i;
    while(last){
        i = Math.floor(Math.random() * last--);
        lastValue = array[last];
        [array[last], array[i]] = [array[i], array[last]];
    }
    return array;
};

function makeAGuess(game) {
    let guess = $('#player-input').val();
    $('#player-input').val("");
    let output = game.playersGuessSubmission(parseInt(guess,10));
    let color = 256 - (game.difference()*10)
    $('#app').css({'background-color': `rgba(${color}, 0, 0, 0.5)`});
    $('#subtitle').css({'color': 'white'});
    $('#title').css({'color': 'white'});
    $('#title').text(output);
    if (output ==='You Lose.') $('#app').css({'background-color': `rgba(0, 0, 0, 0.5)`});
};


$(document).ready(function() {
    let game = new Game();
    $('#submit').click(function() {
        makeAGuess(game);
        $('#player-input').focus()

    });
    $('#player-input').keypress(function(event) {
        if (event.which === 13) makeAGuess(game);
        $('#player-input').focus()

    });
    $('#hint').click( function(){
        let gameHint = game.provideHint().join(' ');
        if(game.oneTime > 0) $('#subtitle').text(`One of these are the winning number: ${gameHint}`);
    });
    $('#reset').click( function(){
        game = new Game();
        $('#title').text('Play the Guessing Game!');
        $('#subtitle').text('Guess a number between 1-100!');
        $('.guess').text('');
        $('#submit').attr('disabled', false);
        $('#app').css({'background-color': `rgba(256, 256, 256, 0.5)`});
        $('#subtitle').css({'color': 'black'});
        $('#title').css({'color': 'black'});
    })

});

