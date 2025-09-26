// mobile-app\api\authServices.ts

import axios from 'axios';

import { UserType } from '~/store/auth';

export interface DealerRegistrationData {
  phone: string;
  email: string;
  otp: string;
  first_name: string;
  last_name: string;
  usertype: string;
  gstin: string;
  pncd: string;
  loc: string;
  dst: string;
  stcd: string;
  adr: string;
}

export interface TechnicianRegistrationData {
  phone: string;
  email: string;
  otp: string;
  first_name: string;
  last_name: string;
  dealerId: string;
}

export interface BackOfficeRegistrationData {
  phone: string;
  email: string;
  otp: string;
  first_name: string;
  last_name: string;
  dealerId: string;
}

export const API_URL = 'https://ariss-app-dev.onrender.com/api';

export const sendOTP = async (phone: string, email: string) => {
  return axios.post(`${API_URL}/otp`, { phone, email });
};

export const verifyOTP = async (phone: string, email: string, otp: string, userType: UserType) => {
  return axios.post(`${API_URL}/users/login`, { phone, email, otp, userType });
};

export const registerVerifyOTP = async (phone: string, email: string, otp: string) => {
  return axios.post(`${API_URL}/users/login`, { phone, email, otp });
};

export const registerDealer = async (dealerData: DealerRegistrationData) => {
  return axios.post(`${API_URL}/dealer/register`, dealerData);
};

export const registerTechnician = async (techData: TechnicianRegistrationData) => {
  return axios.post(`${API_URL}/technician/register`, techData);
};

export const registerBackOffice = async (backOfficeData: BackOfficeRegistrationData) => {
  return axios.post(`${API_URL}/back-office/register`, backOfficeData);
};

export const dealerProfile = async (token: string) => {
  return axios.get(`${API_URL}/dealer/profile`, {
    headers: {
      Authorization: `Bearer ${token}`, // Send token in Authorization header
    },
    withCredentials: true, // Allow credentials
  });
};

export const backOfficeProfile = async (token: string) => {
  return axios.get(`${API_URL}/back-office/check`, {
    headers: {
      Authorization: `Bearer ${token}`, // Send token in Authorization header
    },
    withCredentials: true, // Allow credentials
  });
};

export const technicianProfile = async (token: string) => {
  return axios.get(`${API_URL}/technician/check`, {
    headers: {
      Authorization: `Bearer ${token}`, // Send token in Authorization header
    },
    withCredentials: true, // Allow credentials
  });
};
