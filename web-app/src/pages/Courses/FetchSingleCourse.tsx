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
    id: string;
    title: string;
    description: string;
    content: string;
    isActive: boolean;
    createdAt: string;
};

const FetchSingleCourse = () => {
    const [data, setData] = useState<Course | null>(null);
    const [loading, setLoading] = useState(false);
    const [showContent, setShowContent] = useState(false);
    const { course_id } = useParams();

    const loadCourse = async (course_id: string) => {
        if (!course_id) return;
        setLoading(true);
        try {
            const response = await getACourse(course_id);
            console.log(response.data);
            setData(response.data);
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

    if (!data) {
        return (
            <div className="flex justify-center items-center w-full min-h-screen font-work">
                <p className="text-lg text-gray-600">No course data found.</p>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center w-full font-work lg:p-10">
            <form className="flex justify-start items-start w-full flex-col gap-y-6">
                <div className="flex justify-start items-start flex-col gap-y-2">
                    <Label>Course ID</Label>
                    <Input
                        value={data.id}
                        disabled
                        className="lg:min-w-[320px] lg:max-w-[350px] rounded shadow"
                    />
                </div>
                <div className="flex justify-start items-start flex-col gap-y-2">
                    <Label>Course Title</Label>
                    <Input
                        value={data.title}
                        disabled
                        className="lg:min-w-[320px] lg:max-w-[350px] rounded shadow"
                    />
                </div>
                <div className="flex justify-start items-start flex-col gap-y-2">
                    <Label>Course Description</Label>
                    <Input
                        value={data.description}
                        disabled
                        className="lg:min-w-[500px] lg:max-w-[580px] rounded shadow truncate"
                    />
                </div>
                <div className="flex justify-start items-start flex-col gap-y-2">
                    <Label>Publish Status</Label>
                    <Input
                        value={data.isActive ? 'Published' : 'Unpublished'}
                        disabled
                        className="lg:min-w-[320px] lg:max-w-[350px] rounded shadow"
                    />
                </div>
                <div className="flex justify-start items-start flex-col gap-y-2">
                    <Label>Created Date</Label>
                    <Input
                        value={data.createdAt.split('T')[0]}
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
                        <ReactQuill className="lg:mt-6" value={data.content} readOnly={true} theme="bubble" />
                    )}
                </div>
            </form>
        </div>
    );
};

export default FetchSingleCourse;
