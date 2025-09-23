import axios from 'axios';
import { apiURL } from './apiURL';

export const getAllQuestions = async () => {
    return await axios.get(`${apiURL}/questions`);
};
