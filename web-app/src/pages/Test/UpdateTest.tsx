import { Label } from '../../components/ui/label';
import { getSingleQuestion, updateQuestion } from '../../api/questionAPI';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Textarea } from '../../components/ui/textarea';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Button } from '../../components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';

interface Test {
    test_id: string;
    question: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    correct_option: string;
    course_id: string;
    course: {
        title: string;
    };
}

const UpdateTest = () => {
    const { test_id } = useParams();

    const [test, setTest] = useState<Test | null>(null);
    const [loading, setLoading] = useState(false);

    const [question, setQuestion] = useState('');
    const [optionA, setOptionA] = useState('');
    const [optionB, setOptionB] = useState('');
    const [optionC, setOptionC] = useState('');
    const [optionD, setOptionD] = useState('');
    const [correctOption, setCorrectOption] = useState('');
    const [course, setCourse] = useState('');

    const loadTest = async () => {
        setLoading(true);
        try {
            const response = await getSingleQuestion(test_id!);
            setTest(response.data.data);
            console.log(response.data.data);
        } catch (error) {
            console.error('Error fetching test', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTest();
    }, []);

    useEffect(() => {
        if (test) {
            setQuestion(test.question);
            setOptionA(test.option_a);
            setOptionB(test.option_b);
            setOptionC(test.option_c);
            setOptionD(test.option_d);
            setCorrectOption(test.correct_option);
            setCourse(test.course_id);
        }
    }, [test]);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const payload = {
                question,
                optionA,
                optionB,
                optionC,
                optionD,
                correctOption,
                courseId: course,
            };
            await updateQuestion(test_id!, payload);
            console.log('Question updated');
        } catch (error) {
            console.log('Error updating question', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        <div className="flex justify-center items-center w-full min-h-screen">
            <Loader2 className="w-8 h-8 animate-spin" />
        </div>;
    }

    return (
        <div className="flex justify-start items-start w-full min-h-screen flex-col lg:gap-y-10">
            <h1 className="font-work text-left text-[16px] font-semibold capitalize dark:text-stone-100 text-[#495057] flex items-center lg:mt-4">
                <Link to="/tests">
                    <ArrowLeft className="w-4 h-4 mr-2 " />
                </Link>
                Update Question:
            </h1>
            <form
                onSubmit={handleSubmit}
                className="flex justify-start items-start flex-col lg:gap-y-6 lg:mt-4"
            >
                <div className="flex justify-start items-start flex-col lg:gap-y-3 font-work capitalize dark:text-stone-100 text-stone-800">
                    <Label>Course</Label>
                    <Input type="text" value={test?.course.title} disabled className="rounded lg:w-[450px]" />
                </div>

                <div className="flex justify-start items-start flex-col lg:gap-y-3 font-work capitalize dark:text-stone-100 text-stone-800">
                    <Label>
                        Question<sup className="opacity-50">*</sup>
                    </Label>
                    <Textarea
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Enter Question"
                        className="rounded lg:w-[450px]"
                    />
                </div>
                <div className="flex justify-start items-center lg:gap-x-6">
                    <div className="flex justify-start items-start flex-col lg:gap-y-3 font-work capitalize dark:text-stone-100 text-stone-800">
                        <Label>
                            Option A<sup className="opacity-50">*</sup>
                        </Label>
                        <Input
                            type="text"
                            value={optionA}
                            onChange={(e) => setOptionA(e.target.value)}
                            placeholder="Enter Option A"
                            className="rounded lg:w-[210px]"
                        />
                    </div>
                    <div className="flex justify-start items-start flex-col lg:gap-y-3 font-work capitalize dark:text-stone-100 text-stone-800">
                        <Label>
                            Option B<sup className="opacity-50">*</sup>
                        </Label>
                        <Input
                            type="text"
                            value={optionB}
                            onChange={(e) => setOptionB(e.target.value)}
                            placeholder="Enter Option B"
                            className="rounded lg:w-[210px]"
                        />
                    </div>
                </div>
                <div className="flex justify-start items-center lg:gap-x-6">
                    <div className="flex justify-start items-start flex-col lg:gap-y-3 font-work capitalize dark:text-stone-100 text-stone-800">
                        <Label>
                            Option C<sup className="opacity-50">*</sup>
                        </Label>
                        <Input
                            type="text"
                            value={optionC}
                            onChange={(e) => setOptionC(e.target.value)}
                            placeholder="Enter Option C"
                            className="rounded lg:w-[210px]"
                        />
                    </div>
                    <div className="flex justify-start items-start flex-col lg:gap-y-3 font-work capitalize dark:text-stone-100 text-stone-800">
                        <Label>
                            Option D<sup className="opacity-50">*</sup>
                        </Label>
                        <Input
                            type="text"
                            value={optionD}
                            onChange={(e) => setOptionD(e.target.value)}
                            placeholder="Enter Option D"
                            className="rounded lg:w-[210px]"
                        />
                    </div>
                </div>
                <div className="flex flex-col lg:gap-y-3 font-work capitalize dark:text-stone-100 text-stone-800">
                    <Label>
                        Correct Option<sup className="opacity-50">*</sup>
                    </Label>
                    <Select value={correctOption} onValueChange={(value) => setCorrectOption(value)}>
                        <SelectTrigger className="lg:w-[450px] rounded">
                            <SelectValue placeholder="Choose correct option" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="OPTION_A">Option A</SelectItem>
                            <SelectItem value="OPTION_B">Option B</SelectItem>
                            <SelectItem value="OPTION_C">Option C</SelectItem>
                            <SelectItem value="OPTION_D">Option D</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Button type="submit" className="lg:px-6 lg:py-2 rounded font-work">
                    {loading ? <Loader2 className="animate-spin" /> : 'Submit'}
                </Button>
            </form>
        </div>
    );
};

export default UpdateTest;
