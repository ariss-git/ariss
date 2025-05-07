import axios from 'axios';

import { API_URL } from './productServices';

export const getAllActiveCourse = async () => {
  return axios.get(`${API_URL}/user-course`);
};
