const letters = document.querySelectorAll('.letter');
const container = document.querySelector('.words')
const loader = document.querySelector('.loader')
const body = document.body
const WORD_LENGTH = 5;

let currentGuess = "";
let guess = 0;
let word = "";
let loading = true;
let end = false;

async function init() {
    show()
    const res = await fetch("https://words.dev-apis.com/word-of-the-day");
    const resj = await res.json();
    loading = false;
    hide()
    word = resj.word.toUpperCase();
    if (!loading && !end) {
        document.addEventListener('keydown', handleKeydown);
    }
}
function handleKeydown(e) {
    if (isLetter(e.key)) {
        addletter(e.key.toUpperCase());
    } else if (e.key === "Backspace") {
        back();
    } else if (e.key === "Enter") {
        validate(currentGuess);
    }
};

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

async function validate(letter) {
    const res = await fetch("https://words.dev-apis.com/validate-word", {
        method: "POST",
        body: JSON.stringify({ "word": letter }),
    });
    const { validWord } = await res.json();
    if (guess < 5) {
        if (validWord) {
            if (letter === word) {
                for (let i = 0; i < WORD_LENGTH; i++) {
                    letters[guess * WORD_LENGTH + i].classList.add('correct');
                }
                container.classList.add('winning')
                body.classList.add('winning')
                end = true;
            } else {
                const wordlist = word.split('');
                const curlist = currentGuess.split('');
                const freq = {};

                for (let i = 0; i < WORD_LENGTH; i++) {
                    if (wordlist[i] in freq) {
                        freq[wordlist[i]] += 1;
                    } else {
                        freq[wordlist[i]] = 1;
                    }
                }

                for (let i = 0; i < WORD_LENGTH; i++) {
                    if (curlist[i] === wordlist[i]) {
                        letters[guess * WORD_LENGTH + i].classList.add('correct');
                        freq[curlist[i]] -= 1;
                    }
                }

                for (let i = 0; i < WORD_LENGTH; i++) {
                    if (curlist[i] !== wordlist[i]) {
                        if (wordlist.includes(curlist[i]) && freq[curlist[i]] > 0) {
                            letters[guess * WORD_LENGTH + i].classList.add('close');
                            freq[curlist[i]] -= 1;
                        } else {
                            letters[guess * WORD_LENGTH + i].classList.add('wrong');
                        }
                    }
                }

                guess++;
                currentGuess = "";
            }
        } else {

            for (let i = 0; i < WORD_LENGTH; i++) {
                letters[guess * WORD_LENGTH + i].classList.add('invalid');
            }
            setTimeout(() => {
                for (let i = 0; i < WORD_LENGTH; i++) {
                    letters[guess * WORD_LENGTH + i].classList.remove('invalid');
                }
            }, 200);


        }
    } else {
        container.classList.add('lose');
        setTimeout(() => {
            alert("YOU LOSE");
        }, 100);
        end = true;
    }
}

function show() {
    loader.style.display = 'block';
}

function hide() {
    loader.style.display = 'none';
}

function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
}

init();