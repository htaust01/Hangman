"use strict";

const image = document.getElementById("gamePic");
const submitBtn = document.getElementById("submitBtn")
const wordDisplay = document.getElementById("word");

let currentWord = "HANGMAN";
let wordArr = [];
let guessArr = [];
let prevGuesses = [];

for(let i = 0; i < currentWord.length; i++)
{
   wordArr.push(currentWord.charAt(i));
   guessArr.push("_");
}

wordDisplay.innerText = guessArr.join(" ");
