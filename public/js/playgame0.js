"use strict";

const hangmanPic = document.getElementById("hangmanPic");
const submitBtn = document.getElementById("submitBtn");
const resetBtn = document.getElementById("resetBtn");
const nextBtn = document.getElementById("nextBtn");
const puzzle = document.getElementById("puzzle");
const feedback = document.getElementById("feedback");
const letterGuess = document.getElementById("letterGuess");
const guessedLetters = document.getElementById("guessedLetters");

const words = ["HAPPY", "LITTLE", "HANGMAN"]
let wordArr = [];
let guessArr = [];
let prevGuesses = [];
let currentImage = 1;
let usedLetters = [];
let guessesLeft = 7;
let gameLevel = 1;
let currentWord = words[gameLevel - 1];

const getRandomWordFromApi = async () => {
	try {
		const response = await fetch(`https://random-word-api.herokuapp.com/word?length=${gameLevel + 4}`);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching data:", error);
		return null;
	}
}

const getWord = async () =>
{
	//currentWord = "HANGMAN";
	//console.log(currentWord);
	//let newWord;
	//getRandomWordFromApi().then(data => {
	//	console.log(data[0]);
	//	currentWord = data[0];
		
	//});
	/*
	const data = await getRandomWordFromApi();
	if(!data) {
		feedback.innerText = "Problems with the API, try again later.";
		return;
	}
	console.log(data[0]);
	currentWord = await data[0];
	*/
	currentWord = words[gameLevel - 1];
	console.log(currentWord);
	
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
	if(guessesLeft <= 0) {
		feedback.innerText = "You have already lost. Press Reset to play again or check your score on the Scores page.";
		return;
	}
	if(!isValidGuess(guess)) {
		feedback.innerText = "That is an invalid guess. Try Again.";
		return;
	}
	if(prevGuesses.includes(guess)) {
		feedback.innerText = `You have already guessed the letter '${guess}'. Try Again.`;
		return;
	}
	prevGuesses.push(guess)
	guessedLetters.innerText = prevGuesses;
	if(!currentWord.includes(guess)) {
		guessesLeft--;
		feedback.innerText = `The puzzle does not contain the letter '${guess}'. You have ${guessesLeft} guesses left.`;
		changePic();
		if(guessesLeft === 0) {
			loseGame();
			submitBtn.style.display = "none";
			resetBtn.innerText = "Reset";
			resetBtn.style.display = "inline";
			gameLevel = 1;
		}
		return;
	}
	updatePuzzle(guess);
	if(wordArr.join("") === guessArr.join("")) {
		feedback.innerText = `The puzzle does contain the letter '${guess}'. You have WON with ${guessesLeft} guesses left! Congratulations!`;
		gameLevel++;
		submitBtn.style.display = "none";
		resetBtn.innerText = "Next";
		resetBtn.style.display = "inline";
		return;
	}
	feedback.innerText = `The puzzle does contain the letter '${guess}'. You have ${guessesLeft} guesses left.`;
}

const resetGame = () => {
	submitBtn.style.display = "inline";
	resetBtn.style.display = "none";
	guessesLeft = 7;
	currentImage = 1;
	prevGuesses = [];
	guessedLetters.innerText = prevGuesses;
	getWord();
	makeWordArrays();
	updatePuzzle("");
	hangmanPic.src = `./imgs/hangman0${currentImage}.png`;
	feedback.innerText = "Make a Guess";
}


getWord();
console.log(currentWord);
makeWordArrays();
updatePuzzle("");
submitBtn.addEventListener("click", makeGuess);
resetBtn.addEventListener("click", resetGame);
nextBtn.addEventListener("click", nextPuzzle);