import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: String,
  userAnswer: String
});

const quizAttemptSchema = new mongoose.Schema({
  topic: String,
  questions: [questionSchema],
  score: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const QuizAttempt = mongoose.model('QuizAttempt', quizAttemptSchema);
export default QuizAttempt;
