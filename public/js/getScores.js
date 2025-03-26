"use strict";

const wordList = document.getElementById("wordList");
const wordAnalysis = document.getElementById("wordAnalysis");
const guessAnalysis = document.getElementById("guessAnalysis");

const wordHistory = JSON.parse(localStorage.getItem("wordHistory"));
const guessHistory = JSON.parse(localStorage.getItem("guessHistory"));

console.log(wordHistory);
console.log(guessHistory);

const populateWordList = () => {
	if(wordHistory) {
		wordList.innerHTML = "";
		wordHistory.forEach(word => {
			wordList.innerHTML += `<li>${word}</li>`;
		});
	}
};

const countLetters = stringArr => {
	if(!stringArr) return null;
	const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	let result = {};
	alphabet.split("").forEach(letter => {
		result[letter] = 0;
	});
	stringArr.join("").split("").forEach(letter => {
		result[letter]++;
	});
	return result;
};

const getMostCommonLetters = letterCounts => {
	let result = [];
	let currentMax = 0;
	Object.keys(letterCounts).forEach((letter) => {
		if(letterCounts[letter] > currentMax) {
			result = [letter];
			currentMax = letterCounts[letter];
		} else if (letterCounts[letter] === currentMax) {
			result.push(letter);
		}
	});
	return result;
};

const analyzeHistory = (stringArr, analysis) => {
	const letterCounts = countLetters(stringArr);
	console.log(JSON.stringify(letterCounts));
	if(!letterCounts) return;
	const mostCommonLetters = getMostCommonLetters(letterCounts);
	analysis.innerHTML = `<p>Most Common Letter${mostCommonLetters.length === 1 ? "" : "s"}: ${mostCommonLetters}</p><p>Letter Counts:</p>`;
	Object.keys(letterCounts).forEach(letter => {
		if(letterCounts[letter]) {
			analysis.innerHTML += `<li>${letter}: ${letterCounts[letter]}</li>`;
		}
	});
};

populateWordList();
analyzeHistory(wordHistory, wordAnalysis);
analyzeHistory(guessHistory, guessAnalysis);