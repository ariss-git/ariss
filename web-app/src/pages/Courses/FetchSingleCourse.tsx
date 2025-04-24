import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button'; // Make sure you have this
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getACourse } from '../../api/courseAPI';
import { Loader2 } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css';

type Course = {
    course_id: string;
    title: string;
    content: string;
    isPublished: boolean;
    createdAt: string;
};

const FetchSingleCourse = () => {
    const [data, setData] = useState<Course[]>([]);
    const [loading, setLoading] = useState(false);
    const [showContent, setShowContent] = useState(false);
    const { course_id } = useParams();

    const loadCourse = async (course_id: string) => {
        if (!course_id) return;
        setLoading(true);
        try {
            const response = await getACourse(course_id);
            setData(response.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCourse(course_id!);
    }, [course_id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center w-full min-h-screen">
                <Loader2 className="h-16 w-16 stroke-[1] text-gray-800 dark:text-gray-400 animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center w-full font-work lg:p-10">
            {data.map((course) => (
                <form
                    key={course.course_id}
                    className="flex justify-start items-start w-full flex-col gap-y-6"
                >
                    <div className="flex justify-start items-start flex-col gap-y-2">
                        <Label>Course ID</Label>
                        <Input
                            value={course.course_id}
                            disabled
                            className="lg:min-w-[320px] lg:max-w-[350px] rounded shadow"
                        />
                    </div>
                    <div className="flex justify-start items-start flex-col gap-y-2">
                        <Label>Course Title</Label>
                        <Input
                            value={course.title}
                            disabled
                            className="lg:min-w-[320px] lg:max-w-[350px] rounded shadow"
                        />
                    </div>
                    <div className="flex justify-start items-start flex-col gap-y-2">
                        <Label>Publish Status</Label>
                        <Input
                            value={course.isPublished ? 'Published' : 'Unpublished'}
                            disabled
                            className="lg:min-w-[320px] lg:max-w-[350px] rounded shadow"
                        />
                    </div>
                    <div className="flex justify-start items-start flex-col gap-y-2">
                        <Label>Created Date</Label>
                        <Input
                            value={course.createdAt.split('T')[0]}
                            disabled
                            className="lg:min-w-[320px] lg:max-w-[350px] rounded shadow"
                        />
                    </div>

                    {/* Toggle Button */}
                    <div className="flex flex-col gap-y-2 w-full max-w-4xl">
                        <Button
                            type="button"
                            onClick={() => setShowContent((prev) => !prev)}
                            className="w-fit rounded shadow"
                            variant="outline"
                        >
                            {showContent ? 'Hide Course Content' : 'Show Course Content'}
                        </Button>

                        {showContent && (
                            <>
                                <ReactQuill
                                    className="lg:mt-6"
                                    value={course.content}
                                    readOnly={true}
                                    theme="bubble"
                                />
                            </>
                        )}
                    </div>
                </form>
            ))}
        </div>
    );
};

export default FetchSingleCourse;
