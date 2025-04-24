import axios from 'axios';
import { apiURL } from './apiURL';

type Course = {
    course_id: string;
    title: string;
    content: string;
    isPublished: boolean;
    createdAt: string;
};

// Get all courses API endpoint
export const getAllCourses = async () => {
    return axios.get(`${apiURL}/course/admin/courses`);
};

// Get single course API endpoint
export const getACourse = async (course_id: string) => {
    return axios.get(`${apiURL}/course/admin/courses/${course_id}`);
};

// Publish course API endpoint
export const publishCourse = async (course_id: string) => {
    return axios.put(`${apiURL}/course/admin/courses/${course_id}/publish`);
};

// Publish course API endpoint
export const unpublishCourse = async (course_id: string) => {
    return axios.put(`${apiURL}/course/admin/courses/${course_id}/unpublish`);
};

// Delete course API endpoint
export const deleteCourse = async (course_id: string) => {
    return axios.delete(`${apiURL}/course/admin/courses/${course_id}`);
};

// Update course API endpoint
export const updateCourse = async (course_id: string, data: Course) => {
    return axios.put(`${apiURL}/course/admin/courses/${course_id}`, data);
};
