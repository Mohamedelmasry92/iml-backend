// quizSchema.js
const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  text: String,
  isCorrect: Boolean,
});

const questionSchema = new mongoose.Schema({
  text: String,
  answers: [answerSchema],
});

const quizSchema = new mongoose.Schema({
  title: String,
  questions: [questionSchema],
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
