async function isValidWord(word) {
    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`);
        return response.ok;
    } catch (error) {
        console.error('Dictionary API error:', error);
        // Fallback to local word list
        return words.includes(word.toLowerCase());
    }
}

function getRandomWord() {
    return words[Math.floor(Math.random() * words.length)].toUpperCase();
}