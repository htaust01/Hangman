"use strict";

const wordList = document.getElementById("wordList");
const wordAnalysis = document.getElementById("wordAnalysis");
const guessAnalysis = document.getElementById("guessAnalysis");

// get histories from local storage
const wordHistory = JSON.parse(localStorage.getItem("wordHistory"));
const guessHistory = JSON.parse(localStorage.getItem("guessHistory"));

console.log(wordHistory);
console.log(guessHistory);

// populates list items in the Word List
const populateWordList = () => {
	if(wordHistory) {
		wordList.innerHTML = "";
		wordHistory.forEach(word => {
			wordList.innerHTML += `<li>${word}</li>`;
		});
	}
};

// creates object with letters as keys and counts as values
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

// analyzes letterCounts object to find the letters that occur most
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

// creates an analysis of a string array and populates the word and guess analysis
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

// fill the page with analysis of user's history
populateWordList();
analyzeHistory(wordHistory, wordAnalysis);
analyzeHistory(guessHistory, guessAnalysis);
