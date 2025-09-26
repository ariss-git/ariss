import { TestServices } from '@/services/test.service.js';
const testServices = new TestServices();
export const addQuestionController = async (req, res) => {
    const { question, optionA, optionB, optionC, optionD, correctOption, courseId } = req.body;
    if (!question || !optionA || !optionB || !optionC || !optionD || !correctOption || !courseId) {
        return res.status(404).json({ success: false, message: 'Required fields are missing' });
    }
    try {
        const test = await testServices.addQuestion(question, optionA, optionB, optionC, optionD, correctOption, courseId);
        return res.status(201).json({ success: true, data: test });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const getAllQuestionsController = async (_req, res) => {
    try {
        const test = await testServices.getAllQuestions();
        return res.status(200).json({ success: true, data: test });
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};
export const deleteQuestionController = async (req, res) => {
    const { testId } = req.params;
    if (!testId) {
        return res.status(404).json({ success: false, message: 'Test ID not found in params' });
    }
    try {
        const test = await testServices.deleteQuestion(testId);
        return res.status(200).json({ success: true, data: test });
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};
