"use strict";

const hangmanPic = document.getElementById("hangmanPic");
const submitBtn = document.getElementById("submitBtn");
const resetBtn = document.getElementById("resetBtn");
const puzzle = document.getElementById("puzzle");
const feedback = document.getElementById("feedback");
const letterGuess = document.getElementById("letterGuess");
const guessedLetters = document.getElementById("guessedLetters");

let wordArr = [];
let guessArr = [];
let prevGuesses = [];
let currentImage = 1;
let guessesLeft = 7;
let gameLevel = 1;
let currentWord = "";
let wordHistory = [];
let guessHistory = [];

const fetchWord = async () => {
	try {
		const response = await fetch(`https://random-word-api.herokuapp.com/word?length=${gameLevel + 4}`);
		const data = await response.json();
		console.log(data);
		currentWord = data[0].toUpperCase();
		console.log(currentWord);
		wordHistory.push(currentWord);
		localStorage.setItem("wordHistory", JSON.stringify(wordHistory));
		resetGame();
	} catch (error) {
		console.error(`Error fetching word: ${error}`);
	}
}

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

const makeWordArrays = () => {
	wordArr = [];
	guessArr = [];
	for(let i = 0; i < currentWord.length; i++) {
		wordArr.push(currentWord.charAt(i));
		guessArr.push("-");
	}
}

const changePic = () => {
   currentImage = currentImage === 8 ? 1 : currentImage + 1;
   hangmanPic.src = `./imgs/hangman0${currentImage}.png`;
}

const isValidGuess = guess => (guess.length === 1) && ("ABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(guess));

const loseGame = () => {
	feedback.innerText += " You LOSE.";
}

const updatePuzzle = (guess) => {
	wordArr.forEach((x, i) => {
		if(x === guess) {
			guessArr[i] = x;
		}
	});
	puzzle.innerText = guessArr.join("");
}

const makeGuess = () => {
	const guess = letterGuess.value.toUpperCase();
	letterGuess.value = "";
	if(guessesLeft <= 0) {  // Already lost game
		feedback.innerText = "You have already lost. Press Reset to play again or check your score on the Scores page.";
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
	prevGuesses.push(guess);
	guessedLetters.innerText = prevGuesses;
	guessHistory.push(guess);
	localStorage.setItem("guessHistory", JSON.stringify(guessHistory));
	if(!currentWord.includes(guess)) { // guessed wrong
		guessesLeft--;
		feedback.innerText = `The puzzle does not contain the letter '${guess}'. You have ${guessesLeft} guesses left.`;
		changePic();
		if(guessesLeft === 0) { // used up all guesses
			loseGame();
			submitBtn.style.display = "none";
			resetBtn.innerText = "Reset";
			resetBtn.style.display = "inline";
			gameLevel = 1;
			puzzle.innerText = currentWord; // reveal puzzle
		}
		return;
	}
	updatePuzzle(guess);
	if(wordArr.join("") === guessArr.join("")) { // solved the puzzle
		feedback.innerText = `The puzzle does contain the letter '${guess}'. You have WON with ${guessesLeft} guesses left! Congratulations!`;
		gameLevel++;
		submitBtn.style.display = "none";
		resetBtn.innerText = "Next";
		resetBtn.style.display = "inline";
		return;
	}
	feedback.innerText = `The puzzle does contain the letter '${guess}'. You have ${guessesLeft} guesses left.`;
}

localStorage.removeItem("wordHistory");
localStorage.removeItem("guessHistory");
submitBtn.addEventListener("click", makeGuess);
resetBtn.addEventListener("click", fetchWord);
fetchWord();
