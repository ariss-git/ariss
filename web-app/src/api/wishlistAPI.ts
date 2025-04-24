import axios from 'axios';
import { apiURL } from './apiURL';

export const getAllWislists = async () => {
    return axios.get(`${apiURL}/wishlists`);
};
