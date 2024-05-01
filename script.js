document.addEventListener('DOMContentLoaded', () => {
    const wordContainer = document.getElementById('word-container')
    const lettersContainer = document.getElementById('letters-container')
    const maxWrongAttempts = 6
    let word = ''
    let guessedLetters = new Set()
    let wrongLetters = new Set()
    let wrongAttempts = 0

    // Getting a random word from the API
    async function getRandomWord() {
        try {
            const response = await fetch('https://random-word-api.herokuapp.com/word?number=1')
            const data = await response.json()
            return data[0]
        } catch (error) {
            console.error('Error:', error)
            return 'javascript' // If error, uses a standard word
        }
    }

    // Starting the game
    async function startGame() {
        word = await getRandomWord()
        guessedLetters.clear()
        wrongLetters.clear()
        wrongAttempts = 0
        updateWrongAttemptsDisplay() 

        // shows the word
        displayWord()

        // show the available letters
        displayAvailableLetters()
    }

    // show "_" for right letters still not guessed
    function displayWord() {
        wordContainer.innerHTML = ''
        word.split('').forEach(letter => {
            const displayLetter = guessedLetters.has(letter) ? letter : '_'
            const letterSpan = document.createElement('span')
            letterSpan.textContent = displayLetter + ' '
            wordContainer.appendChild(letterSpan)
        })
    }

    // show the available letters to guess
    function displayAvailableLetters() {
        lettersContainer.innerHTML = ''
        const alphabet = 'abcdefghijklmnopqrstuvwxyz'
        alphabet.split('').forEach(letter => {
            const letterButton = document.createElement('button')
            letterButton.textContent = letter
            letterButton.className = 'letter'
            letterButton.addEventListener('click', () => {
                handleGuess(letter, letterButton)
            })
            lettersContainer.appendChild(letterButton)
        });
    }

    // guessing a letter
    function handleGuess(letter, letterButton) {
        if (!guessedLetters.has(letter) && !wrongLetters.has(letter)) {
            if (word.includes(letter)) {
                guessedLetters.add(letter)
                letterButton.style.backgroundColor = 'green'
                letterButton.style.color = 'white'
                letterButton.disabled = true
            } else {
                wrongLetters.add(letter)
                wrongAttempts++
                updateWrongAttemptsDisplay()
                letterButton.style.backgroundColor = 'red'
                letterButton.style.color = 'white'
                letterButton.disabled = true

                // checking attempts 
                if (wrongAttempts >= maxWrongAttempts) {
                    setTimeout(() => {
                        alert('You Lose! The correct word is: ' + word.toUpperCase())
                        startGame()
                    }, 200)
                }
            }
            displayWord()

            // checking if the word is guessed
            if (isWordGuessed()) {
                setTimeout(() => {
                    alert('Congratulations! You Won! The correct word is: ' + word.toUpperCase());
                    startGame()
                }, 200)
            }
        }
    }

    //checking if all the letters were guessed
    function isWordGuessed() {
        return word.split('').every(letter => guessedLetters.has(letter))
    }

    // updates the wrong guesses
    function updateWrongAttemptsDisplay() {
        const attemptsElement = document.getElementById('wrong-attempts')
        attemptsElement.textContent = `Wrong guesses: ${wrongAttempts}/${maxWrongAttempts}`
    }

    startGame()
});
