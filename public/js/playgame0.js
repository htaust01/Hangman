"use strict";

const hangmanPic = document.getElementById("hangmanPic");
const submitBtn = document.getElementById("submitBtn");
const resetBtn = document.getElementById("resetBtn");
const puzzle = document.getElementById("puzzle");
const feedback = document.getElementById("feedback");
const letterGuess = document.getElementById("letterGuess");
const guessedLetters = document.getElementById("guessedLetters");

let wordArr = []; // array that contains puzzle word
let guessArr = []; // array that contains -'s and correct letter guesses
let prevGuesses = []; // previous user letter guesses
let currentImage = 1; // current hangman image index (1-8)
let guessesLeft = 7; // number of guesses left
let gameLevel = 1; // current game level
let currentWord = "HANGMAN"; // current puzzle word
let wordHistory = []; // array to store all puzzle words user encounters
let guessHistory = []; // array to store all guesses made

// gets next word and resets game
const fetchWord = async () => {
	try {
		const response = await fetch(`https://random-word-api.herokuapp.com/word?length=${gameLevel + 4 > 15 ? 15 : gameLevel + 4}`); // 15 is max word length for herokuapp API
		// while working on this game the herokuapp API went down, if this happens the API below can also get random words but the max word length is 9
		//const response = await fetch(`https://random-word-api.vercel.app/api?length=${gameLevel + 4 > 9 ? 9 : gameLevel + 4}`); // 9 is max word length for vercel API
		const data = await response.json();
		console.log(data);
		currentWord = data[0].toUpperCase();
		console.log(currentWord);
		wordHistory.push(currentWord);
		localStorage.setItem("wordHistory", JSON.stringify(wordHistory));
		resetGame();
		// possible improvement is to get the word's definition from a dictionary API and display that to the user
	} catch (error) {
		console.error(`Error fetching word: ${error}`);
	}
}

// reset to new puzzle
const resetGame = () => {
	submitBtn.style.display = "inline";
	resetBtn.style.display = "none";
	guessesLeft = 7;
	currentImage = 1;
	prevGuesses = [];
	guessedLetters.innerText = "";
	makeWordArrays();
	updatePuzzle("");
	hangmanPic.src = `./imgs/hangman0${currentImage}.png`;
	feedback.innerText = "Make a Guess";
}

// populates arrays for playing game
const makeWordArrays = () => {
	wordArr = [];
	guessArr = [];
	for(let i = 0; i < currentWord.length; i++) {
		wordArr.push(currentWord.charAt(i));
		guessArr.push("-");
	}
}

// changes pic to next in sequence
const changePic = () => {
   currentImage = currentImage === 8 ? 1 : currentImage + 1;
   hangmanPic.src = `./imgs/hangman0${currentImage}.png`;
}

// determine if guess is valid (one character that is a letter)
// could change to a regular expression for another capstone item
const isValidGuess = guess => (guess.length === 1) && ("ABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(guess));

// adds to feedback text when you lose
const loseGame = () => {
	feedback.innerText += " You LOSE.";
}

// updates puzzle after new guess
const updatePuzzle = (guess) => {
	wordArr.forEach((x, i) => {
		if(x === guess) {
			guessArr[i] = x;
		}
	});
	puzzle.innerText = guessArr.join("");
}

// plays the game after a guess is made
const makeGuess = () => {
	const guess = letterGuess.value.toUpperCase();
	letterGuess.value = "";
	if(guessesLeft <= 0) {  // Already lost game (inside code should be unreachable)
		feedback.innerHTML = "You have already lost. Press Reset to play again or check your score on the <a href='./scores.html'>Scores</a> page.";
		return;
	}
	if(!isValidGuess(guess)) { // Invalid guess
		feedback.innerText = "That is an invalid guess. Try Again.";
		return;
	}
	if(prevGuesses.includes(guess)) { // Guessed same letter again
		feedback.innerText = `You have already guessed the letter '${guess}'. Try Again.`;
		return;
	}
	prevGuesses.push(guess); // at this point the guess is valid and new
	guessedLetters.innerText = prevGuesses;
	guessHistory.push(guess);
	localStorage.setItem("guessHistory", JSON.stringify(guessHistory));
	if(!currentWord.includes(guess)) { // guessed wrong
		guessesLeft--;
		feedback.innerText = `The puzzle does not contain the letter '${guess}'. You have ${guessesLeft} guess${guessesLeft === 1 ? '' : 'es'} left.`;
		changePic();
		if(guessesLeft === 0) { // used up all guesses so the player loses
			loseGame();
			submitBtn.style.display = "none";
			resetBtn.innerText = "Reset";
			resetBtn.style.display = "inline";
			gameLevel = 1;
			puzzle.innerText = currentWord; // reveal puzzle
		}
		return;
	} // at this point the guess is correct
	updatePuzzle(guess);
	if(wordArr.join("") === guessArr.join("")) { // solved the puzzle
		feedback.innerText = `The puzzle does contain the letter '${guess}'. You have WON with ${guessesLeft} guess${guessesLeft === 1 ? '' : 'es'} left! Congratulations!`;
		gameLevel++;
		submitBtn.style.display = "none";
		resetBtn.innerText = "Next";
		resetBtn.style.display = "inline";
		return;
	}
	feedback.innerText = `The puzzle does contain the letter '${guess}'. You have ${guessesLeft} guess${guessesLeft === 1 ? '' : 'es'} left.`; // guessed correct but did not complete puzzle
}

// clear local storage
localStorage.removeItem("wordHistory");
localStorage.removeItem("guessHistory");

// add functions to buttons
submitBtn.addEventListener("click", makeGuess);
resetBtn.addEventListener("click", fetchWord);

// start game
fetchWord();
