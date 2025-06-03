class WordleGame {
    constructor() {
        this.targetWord = getRandomWord();
        this.currentRow = 0;
        this.currentGuess = '';
        this.gameOver = false;
        this.maxGuesses = 6;
        this.guesses = [];
        
        this.initializeBoard();
        console.log('Target word:', this.targetWord); // For testing - remove in production
    }

    initializeBoard() {
        const board = document.getElementById('board');
        board.innerHTML = '';
        
        for (let i = 0; i < this.maxGuesses; i++) {
            const row = document.createElement('div');
            row.className = 'row';
            row.id = `row-${i}`;
            
            for (let j = 0; j < 5; j++) {
                const tile = document.createElement('div');
                tile.className = 'tile';
                tile.id = `tile-${i}-${j}`;
                row.appendChild(tile);
            }
            
            board.appendChild(row);
        }
    }

    async makeGuess(word) {
        if (this.gameOver) {
            return { success: false, message: 'Game is over!' };
        }

        if (word.length !== 5) {
            return { success: false, message: 'Word must be 5 letters long!' };
        }

        // Check if word is valid using API
        const isValid = await isValidWord(word);
        if (!isValid) {
            return { success: false, message: 'Not a valid word!' };
        }

        word = word.toUpperCase();
        this.guesses.push(word);
        
        // Update the board with the guess
        this.updateBoard(word, this.currentRow);
        
        // Check if the guess is correct
        if (word === this.targetWord) {
            this.gameOver = true;
            setTimeout(() => {
                this.animateWin();
            }, 1500);
            return { success: true, message: 'Congratulations! You won!', gameWon: true };
        }

        this.currentRow++;

        // Check if out of guesses
        if (this.currentRow >= this.maxGuesses) {
            this.gameOver = true;
            return { 
                success: true, 
                message: `Game over! The word was: ${this.targetWord}`, 
                gameLost: true 
            };
        }

        return { success: true, message: `Guess ${this.currentRow}/6` };
    }

    updateBoard(word, rowIndex) {
        const letters = word.split('');
        const targetLetters = this.targetWord.split('');
        const letterCounts = {};
        
        // Count letters in target word
        targetLetters.forEach(letter => {
            letterCounts[letter] = (letterCounts[letter] || 0) + 1;
        });

        // First pass: mark correct positions
        const results = new Array(5).fill('absent');
        letters.forEach((letter, index) => {
            const tile = document.getElementById(`tile-${rowIndex}-${index}`);
            tile.textContent = letter;
            tile.classList.add('filled');
            
            if (letter === targetLetters[index]) {
                results[index] = 'correct';
                letterCounts[letter]--;
            }
        });

        // Second pass: mark present letters
        letters.forEach((letter, index) => {
            if (results[index] !== 'correct' && letterCounts[letter] > 0) {
                results[index] = 'present';
                letterCounts[letter]--;
            }
        });

        // Apply colors with animation delay
        letters.forEach((letter, index) => {
            const tile = document.getElementById(`tile-${rowIndex}-${index}`);
            
            setTimeout(() => {
                tile.classList.add('tile-flip');
                tile.classList.add(results[index]);
            }, index * 100);
        });
    }

    animateWin() {
        const row = document.getElementById(`row-${this.currentRow}`);
        row.classList.add('row-bounce');
    }

    animateInvalidWord() {
        const row = document.getElementById(`row-${this.currentRow}`);
        row.classList.add('row-shake');
        setTimeout(() => {
            row.classList.remove('row-shake');
        }, 500);
    }

    reset() {
        this.targetWord = getRandomWord();
        this.currentRow = 0;
        this.currentGuess = '';
        this.gameOver = false;
        this.guesses = [];
        this.initializeBoard();
        console.log('New target word:', this.targetWord); // For testing
    }
}