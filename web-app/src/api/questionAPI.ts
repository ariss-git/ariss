import axios from 'axios';
import { apiURL } from './apiURL';

export const getAllQuestions = async () => {
    return await axios.get(`${apiURL}/questions`);
};

export const deleteQuestion = async (testId: string) => {
    return await axios.delete(`${apiURL}/questions/${testId}`);
};
