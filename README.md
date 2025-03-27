# Hangman

## Overview:
> The project is a game of hangman. It will get a random word from the random word api. The user will guess letters in the word. If they get all the letters of the word before a certain number of incorrect guesses they win the round. Each additional round gets a longer word from the api. There will be an intro.instructions page, a game page, and a scores page. The web app will be responsive and use html, css, and javascript. I will use flex box for alignment.

## Features:
> - *Use arrays, objects, sets, or maps to store and retrieve information that is displayed in your app.* The app will store the previous guesses of the user in an array. It will also store all previous words and guesses in local storage.
> - *Analyze data that is stored in arrays, objects, sets or maps and display information about it in your app.* The app will analyze the guesses stored in the array and replace blanks in the word with the correct guesses. It will also analyze the history and let the user know the words they've played, what letters occur most frequently, what letters they guess most frequently, and the letter counts of each all the words they encountered and all the guesses they have made on the scores page.
> - *Retrieve data from a third-party API and use it to display something within your app.* The app will get a word from the random word api here https://random-word-api.herokuapp.com/home and use that word for the hangman game. As the user progresses the words get longer.

## Instructions:
> Clone the repository and open index.html in your browser. Click the Play Game link to play. Enter your guesses in the input box and press submit. When you are done playing you can click on the Scores link at the top and see the analysis of your games.
