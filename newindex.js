const express = require('express');
const path = require('path');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
const fs = require('fs');
const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static('./'));
app.use(session({
  secret: 'hey man',
  resave: false,
  saveUninitialized: true
}));
app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');

var randomWord = words[Math.floor(Math.random() * words.length)];
console.log("Mystery word: " + randomWord);
const splitWord = randomWord.split([,]);
console.log(splitWord);
var secretWord = randomWord.replace(/[a-z]/g,"_");
console.log(secretWord);
secretWord = secretWord.split('');
console.log(secretWord);
var joinWord = secretWord.join('');

function newWord() {
  const randomWord = words[Math.floor(Math.random() * words.length)];
  console.log("Mystery word: " + randomWord);
  const splitWord = randomWord.split([,]);
  console.log(splitWord);
};

var lettersGuessed = [];
var guessCount = 0;

function gameOver() {
  if (guessCount === 8) {
    guessCount =  0;
    lettersGuessed = [];
    newWord();
  };
};

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/game', function(req, res) {
  res.render('game', {randomWord:joinWord});
});

app.post('/game', function(req, res) {
  var userLetter = req.body.userInput;
  lettersGuessed.push(userLetter.toUpperCase());
  if (randomWord.includes(userLetter)) {
    console.log("Matched letter");
    for (i = 0; i < randomWord.length; i++) {
      if (randomWord[i] === userLetter) {
      secretWord[i] = randomWord[i].replace('_', userLetter);
      console.log("User letter: " + userLetter);
      }
    }
  };
  guessCount += 1;
  console.log("Guess Count: " + guessCount);
  gameOver();
  var joinWord = secretWord.join('');
  res.render('game', {lettersGuessed:lettersGuessed, randomWord:joinWord})
});

app.listen(3000, function(req, res) {
  console.log("Hangman file connected.");
});






// *** Intentional white space ***
