import axios from 'axios';
import { apiURL } from './apiURL';

export const getAllUnreadNotifications = async () => {
    return await axios.get(`${apiURL}/notifications/unread`);
};

export const readAllNotification = async () => {
    return await axios.put(`${apiURL}/notifications`);
};
