import axios from 'axios';
import { apiURL } from './apiURL';

type Course = {
    title: string;
    content: {
        body: string;
    };
};

export const addCourse = async (payload: Course) => {
    return await axios.post(`${apiURL}/courses`, payload);
};

export const getAllCourses = async () => {
    return await axios.get(`${apiURL}/courses`);
};

export const getSingleCourse = async (courseId: string) => {
    return await axios.get(`${apiURL}/courses/${courseId}`);
};

export const updateCourse = async (courseId: string, payload: Course) => {
    return await axios.put(`${apiURL}/courses/${courseId}`, payload);
};

export const deleteCourse = async (courseId: string) => {
    return await axios.delete(`${apiURL}/courses/${courseId}`);
};

export const updateToActiveCourse = async (courseId: string) => {
    return await axios.put(`${apiURL}/courses/active/${courseId}`);
};

export const updateToInactiveCourse = async (courseId: string) => {
    return await axios.put(`${apiURL}/courses/inactive/${courseId}`);
};
