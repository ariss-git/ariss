import axios from 'axios';
import { apiURL } from './apiURL';

export const adminLogin = async (email: string, password: string) => {
    return axios.post(
        `${apiURL}/admin/login`,
        { email, password },
        {
            withCredentials: true,
        }
    );
};

export const adminLogout = async () => {
    return axios.post(
        `${apiURL}/admin/logout`,
        {},
        {
            withCredentials: true,
        }
    );
};

export const getAdminProfile = async () => {
    return axios.get(`${apiURL}/admin/profile`, {
        withCredentials: true,
    });
};
