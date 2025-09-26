import { Loader2, PlusCircle } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { useEffect, useState } from 'react';
import { useToast } from '../../hooks/use-toast';
import { Dialog, DialogContent, DialogTrigger } from '../../components/ui/dialog';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { getAllCourses } from '../../api/courseAPI';
import { addQuestion } from '../../api/questionAPI';

type AddTestProps = {
    onSuccess?: () => void;
};

interface Course {
    course_id: string;
    title: string;
}

const AddTest = ({ onSuccess }: AddTestProps) => {
    const [question, setQuestion] = useState('');
    const [optionA, setOptionA] = useState('');
    const [optionB, setOptionB] = useState('');
    const [optionC, setOptionC] = useState('');
    const [optionD, setOptionD] = useState('');
    const [correctOption, setCorrectOption] = useState('');

    const [loading, setLoading] = useState<boolean>(false);
    const { toast } = useToast();

    const [courseData, setCourseData] = useState<Course[]>([]);
    const [courseId, setCourseId] = useState('');
    const [selectedCourseTitle, setSelectedCourseTitle] = useState('');

    const loadCourses = async () => {
        try {
            const response = await getAllCourses();
            setCourseData(response.data.data);
        } catch (error) {
            console.error('Unable to fetch courses', error);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        if (!selectedCourseTitle) return;
        try {
            const payload = {
                question,
                optionA,
                optionB,
                optionC,
                optionD,
                correctOption,
                courseId,
            };

            const response = await addQuestion(payload);
            console.log(response.data);
            onSuccess?.();
            setQuestion('');
            setOptionA('');
            setOptionB('');
            setOptionC('');
            setOptionD('');
            setCorrectOption('');
            setCourseId('');
            toast({
                description: 'Question has been added',
                className: 'rounded bg-green-500 text-black font-work',
            });
        } catch (error) {
            console.error(error);
            toast({
                description: 'There was an error adding question',
                className: 'rounded bg-red-500 text-black font-work',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCourses();
    }, []);

    return (
        <div className="flex flex-col lg:gap-y-6 justify-start w-full h-full bg-transparent">
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="default" className="rounded">
                        Add Question <PlusCircle className="ml-2 h-4 w-4" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="rounded-md shadow max-h-[80%] overflow-y-auto">
                    <form
                        onSubmit={handleSubmit}
                        className="flex justify-start items-start flex-col lg:gap-y-6 lg:mt-4"
                    >
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

                        <div className="flex flex-col lg:gap-y-3 font-work capitalize dark:text-stone-100 text-stone-800">
                            <Label>
                                Select Course<sup className="opacity-50">*</sup>
                            </Label>
                            <Select
                                value={courseId}
                                onValueChange={(value) => {
                                    setCourseId(value);
                                    const selected = courseData.find((cat) => cat.course_id === value);
                                    setSelectedCourseTitle(selected?.title || '');
                                }}
                            >
                                <SelectTrigger className="lg:w-[450px] rounded">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {courseData.map((cat) => (
                                        <SelectItem key={cat.course_id} value={cat.course_id}>
                                            {cat.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <Button type="submit" className="lg:px-6 lg:py-2 rounded font-work">
                            {loading ? <Loader2 className="animate-spin" /> : 'Submit'}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AddTest;
