const letters = document.querySelectorAll('.letter');
const WORD_LENGTH = 5;

let currentGuess = "";
let guess = 0;
let word = "";

async function init() {
    const res = await fetch("https://words.dev-apis.com/word-of-the-day");
    const resj = await res.json();
    word = resj.word;

    document.addEventListener('keydown', (e) => {
        if (isLetter(e.key)) {
            addletter(e.key.toUpperCase());
        } else if (e.key === "Backspace") {
            back();
        } else if (e.key === "Enter") {
            validite(currentGuess);
        }
    });
}

function addletter(letter) {
    if (currentGuess.length < WORD_LENGTH) {
        currentGuess += letter;
        letters[guess * WORD_LENGTH + currentGuess.length - 1].textContent = currentGuess.slice(-1);
    } else {
        currentGuess = currentGuess.substring(0, currentGuess.length - 1) + letter;
        letters[guess * WORD_LENGTH + currentGuess.length - 1].textContent = currentGuess.slice(-1);
    }
}

function back() {
    currentGuess = currentGuess.substring(0, currentGuess.length - 1);
    letters[guess * WORD_LENGTH + currentGuess.length].textContent = ""
}

async function validite(letter) {
    const valid = await isWordValid(letter);
    if (guess < 5) {
        if (valid) {
            if (letter === word.toUpperCase()) {
                alert("You Win");
                // TODO add css class for winning
            } else {
                guess++;
                currentGuess = "";
                // TODO add css class for how close the word is
            }
        } else {
            // TODO add css class for invalid word          
        }
    } else {
        // TODO add css class for losing
        alert("You Lose");
    }
}

async function isWordValid(letter) {
    const res = await fetch("https://words.dev-apis.com/validate-word", {
        method: "POST",
        body: JSON.stringify({ "word": letter }),
    });
    const { validWord } = await res.json();
    console.log(validWord);
    return validWord;
}

function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
}

init();