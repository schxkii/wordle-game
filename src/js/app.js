let game;
let guessInput;
let submitButton;
let messageDiv;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize game
    game = new WordleGame();
    
    // Get DOM elements
    guessInput = document.getElementById('guess-input');
    submitButton = document.getElementById('submit-guess');
    messageDiv = document.getElementById('message');
    
    // Add event listeners
    submitButton.addEventListener('click', handleGuess);
    guessInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleGuess();
        }
    });
    
    // Input validation
    guessInput.addEventListener('input', function(e) {
        // Only allow letters
        e.target.value = e.target.value.replace(/[^a-zA-Z]/g, '');
        // Convert to uppercase
        e.target.value = e.target.value.toUpperCase();
    });
    
    // Initial message
    showMessage('Enter your first guess!');
});

async function handleGuess() {
    const guess = guessInput.value.trim();
    
    if (!guess) {
        showMessage('Please enter a word!', 'error');
        return;
    }
    
    // Disable input while checking
    disableInput();
    showMessage('Checking word...');
    
    const result = await game.makeGuess(guess);
    
    // Re-enable input
    enableInput();
    
    if (!result.success) {
        showMessage(result.message, 'error');
        if (result.message === 'Not a valid word!') {
            game.animateInvalidWord();
        }
        return;
    }
    
    // Clear input
    guessInput.value = '';
    
    if (result.gameWon) {
        showMessage(result.message, 'win');
        disableInput();
        setTimeout(() => {
            if (confirm('Congratulations! You won! Play again?')) {
                resetGame();
            }
        }, 2000);
    } else if (result.gameLost) {
        showMessage(result.message, 'lose');
        disableInput();
        setTimeout(() => {
            if (confirm(`Game over! The word was: ${game.targetWord}. Play again?`)) {
                resetGame();
            }
        }, 1000);
    } else {
        showMessage(result.message);
    }
}

function showMessage(text, type = '') {
    messageDiv.textContent = text;
    messageDiv.className = '';
    
    if (type) {
        messageDiv.classList.add(`message-${type}`);
    }
}

function disableInput() {
    guessInput.disabled = true;
    submitButton.disabled = true;
}

function enableInput() {
    guessInput.disabled = false;
    submitButton.disabled = false;
    guessInput.focus();
}

function resetGame() {
    game.reset();
    enableInput();
    guessInput.value = '';
    showMessage('Enter your first guess!');
}

// Add keyboard support for better UX
document.addEventListener('keydown', function(e) {
    if (game.gameOver) return;
    
    if (e.key === 'Escape') {
        guessInput.value = '';
        guessInput.focus();
    }
});
