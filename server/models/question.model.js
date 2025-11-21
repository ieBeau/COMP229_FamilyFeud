import mongoose from 'mongoose';

const AnswerSchema = new mongoose.Schema({
    answer: { type: String, required: true, trim: true }, 
    points: { type: Number, required: true }
});

const QuestionSchema = new mongoose.Schema({
    question: { type: String, trim: true, required: "Question is required" },
    answers: [ AnswerSchema ]
});

export default mongoose.model('Question', QuestionSchema)