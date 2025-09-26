import axios from 'axios';
import { apiURL } from './apiURL';

type Question = {
    question: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    correctOption: string;
    courseId: string;
};

export const addQuestion = async (payload: Question) => {
    return await axios.post(`${apiURL}/questions`, payload);
};

export const getAllQuestions = async () => {
    return await axios.get(`${apiURL}/questions`);
};

export const deleteQuestion = async (testId: string) => {
    return await axios.delete(`${apiURL}/questions/${testId}`);
};
