import { TestServices } from '@/services/test.service.js';
import { Request, Response } from 'express';

const testServices = new TestServices();

export const addQuestionController = async (req: Request, res: Response) => {
    const { question, optionA, optionB, optionC, optionD, correctOption, courseId } = req.body;

    if (!question || !optionA || !optionB || !optionC || !optionD || !correctOption || !courseId) {
        return res.status(404).json({ success: false, message: 'Required fields are missing' });
    }

    try {
        const test = await testServices.addQuestion(
            question,
            optionA,
            optionB,
            optionC,
            optionD,
            correctOption,
            courseId
        );
        return res.status(201).json({ success: true, data: test });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
