import * as userService from '../services/userCourse.service.js';
// Enroll user in a course
export const enrollInCourse = async (req, res) => {
    const { courseId } = req.params;
    const { userId, userName, businessName } = req.body; // Extract user info from the request body
    try {
        const result = await userService.enrollInCourse(courseId, userId, userName, businessName);
        return res.status(201).json({ success: true, result });
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};
// Take the test
export const takeTest = async (req, res) => {
    const { courseId } = req.params;
    const { userId, answers } = req.body; // Extract user answers from the request body
    try {
        const result = await userService.takeTest(courseId, userId, answers);
        return res.status(200).json({ success: true, result });
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};
// Get user results for a course
export const getUserResults = async (req, res) => {
    const { courseId } = req.params;
    const { userId } = req.query; // Extract user ID from query parameters
    try {
        const result = await userService.getUserResults(courseId, userId);
        return res.status(200).json({ success: true, result });
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};
// Retake test for a user if they failed
export const retakeTest = async (req, res) => {
    const { courseId } = req.params;
    const { userId } = req.body; // Extract user ID from the request body
    try {
        const result = await userService.retakeTest(courseId, userId);
        return res.status(200).json({ success: true, result });
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};
// Fetch all active courses
export const fetchAllActiveCourses = async (_req, res) => {
    try {
        const courses = await userService.activeCourse();
        return res.status(200).json({ success: true, courses });
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};
