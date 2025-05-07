import axios from 'axios';

import { API_URL } from './productServices';

export const getAllActiveCourse = async () => {
  return axios.get(`${API_URL}/user-course`);
};

export const getSingleCourse = async (courseId: string) => {
  return axios.get(`${API_URL}/course/${courseId}`);
};
