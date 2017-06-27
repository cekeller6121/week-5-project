const express = require('express');
const path = require('path');
const jsfile = require('./jscode.js');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');
const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");

const lettersGuessed = [];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static('./'));
app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');

const randomWord = words[Math.floor(Math.random() * words.length)];
const secretWord = randomWord.replace(/[a-z]/g,"_");
console.log(randomWord);

app.get('/game', function (req, res) {
  res.render('game', {randomWord:secretWord});
});

app.get('/', function (req, res) {
res.render('index');
});

// app.get('/game', function (req, res) {
//   res.render('game', {lettersGuessed:lettersGuessed});
// });

app.post('/game', function (req, res) {
  if (req.body.userInput.length > 1) {
    res.send("You may only enter 1 letter at a time.");
  } else if (lettersGuessed.length === 8) {
    res.send("Game over!");
  } else
  lettersGuessed.push(req.body.userInput.toUpperCase());
  res.render('game', {lettersGuessed:lettersGuessed});
  res.redirect('/game');
  console.log(lettersGuessed);
});



app.listen(3000, function() {
  console.log("Hangman connected to server.")
});
