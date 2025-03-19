"use strict";

const gamePic = document.getElementById("gamePic");
const submitBtn = document.getElementById("submitBtn")
const wordDisplay = document.getElementById("word");
const feedback = document.getElementById("feedback");

let currentWord = "HANGMAN";
let wordArr = [];
let guessArr = [];
let prevGuesses = [];
let currentImage = 1;
let usedLetters = [];

for(let i = 0; i < currentWord.length; i++)
{
   wordArr.push(currentWord.charAt(i));
   guessArr.push("_");
}

wordDisplay.innerText = guessArr.join(" ");

const changePic = () => {
   currentImage = currentImage === 8 ? 1 : currentImage + 1;
   gamePic.src = `./imgs/hangman0${currentImage}.png`
}

const isValidGuess = guess => guess.length === 1 && "ABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(guess.toUpperCase());

const makeGuess = () => {

}

submitBtn.addEventListener("click", changePic);
