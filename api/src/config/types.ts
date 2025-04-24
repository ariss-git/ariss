// src/config/types.ts

export interface CreateCourseInput {
    title: string;
    content: string; // HTML or Quill delta stored as string
}

export interface AddQuestionInput {
    question: string;
    options: string[]; // length must be 4 (enforced in frontend)
    correctOption: number; // 0-based index
}
