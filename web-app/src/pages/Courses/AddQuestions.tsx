import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { Plus, Trash, Loader2 } from 'lucide-react';
import axios from 'axios';
import { apiURL } from '../../api/apiURL';

type Question = {
    text: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    correct: string;
};

const AddQuestionsToCourse = () => {
    const { courseId } = useParams();
    const [questions, setQuestions] = useState<Question[]>([
        { text: '', optionA: '', optionB: '', optionC: '', optionD: '', correct: '' },
    ]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');

    const handleChange = (index: number, field: keyof Question, value: string) => {
        const updated = [...questions];
        updated[index][field] = value;
        setQuestions(updated);
    };

    const addQuestion = () => {
        setQuestions([
            ...questions,
            { text: '', optionA: '', optionB: '', optionC: '', optionD: '', correct: '' },
        ]);
    };

    const removeQuestion = (index: number) => {
        const updated = [...questions];
        updated.splice(index, 1);
        setQuestions(updated);
    };

    const handleSubmit = async () => {
        if (!courseId) return alert('Invalid course ID');

        setLoading(true);
        try {
            await axios.post(`${apiURL}/course/${courseId}/questions`, questions);
            setSuccess('Questions added successfully!');
            setQuestions([{ text: '', optionA: '', optionB: '', optionC: '', optionD: '', correct: '' }]);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
            <h2 className="text-2xl font-semibold">Add Questions to Course</h2>

            {questions.map((q, index) => (
                <div key={index} className="border p-4 rounded-xl shadow flex flex-col gap-y-4 relative">
                    <Label className="text-lg">Question {index + 1}</Label>

                    <Input
                        placeholder="Enter question text"
                        value={q.text}
                        onChange={(e) => handleChange(index, 'text', e.target.value)}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            placeholder="Option A"
                            value={q.optionA}
                            onChange={(e) => handleChange(index, 'optionA', e.target.value)}
                        />
                        <Input
                            placeholder="Option B"
                            value={q.optionB}
                            onChange={(e) => handleChange(index, 'optionB', e.target.value)}
                        />
                        <Input
                            placeholder="Option C"
                            value={q.optionC}
                            onChange={(e) => handleChange(index, 'optionC', e.target.value)}
                        />
                        <Input
                            placeholder="Option D"
                            value={q.optionD}
                            onChange={(e) => handleChange(index, 'optionD', e.target.value)}
                        />
                    </div>

                    <Input
                        placeholder="Correct Answer (A/B/C/D)"
                        value={q.correct}
                        onChange={(e) => handleChange(index, 'correct', e.target.value)}
                    />

                    {questions.length > 1 && (
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-4 right-4"
                            onClick={() => removeQuestion(index)}
                        >
                            <Trash className="w-4 h-4" />
                        </Button>
                    )}
                </div>
            ))}

            <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={addQuestion}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Another Question
                </Button>

                <Button type="button" onClick={handleSubmit} disabled={loading}>
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            Submitting...
                        </>
                    ) : (
                        'Submit All Questions'
                    )}
                </Button>
            </div>

            {success && <p className="text-green-600">{success}</p>}
        </div>
    );
};

export default AddQuestionsToCourse;
