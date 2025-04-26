import axios from 'axios';
import { apiURL } from './apiURL';

type BackofficeData = {
    phone: string;
    email: string;
    first_name: string;
    last_name: string;
    otp: string;
    usertype: string;
    dealerId: string;
};

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

export const addBackOffice = async (data: BackofficeData) => {
    return axios.post(`${apiURL}/back-office/register`, data);
};

export const sendOTP = async (phone: string, email: string) => {
    return axios.post(`${apiURL}/otp`, { phone, email });
};
