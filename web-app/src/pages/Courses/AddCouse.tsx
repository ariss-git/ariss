import axios from 'axios';
import { toast } from '../../hooks/use-toast';
import { useState } from 'react';
import { apiURL } from '../../api/apiURL';
import { Input } from '../../components/ui/input';
import QuillEditor from '../../_components/QuillEditor';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AddCourse = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async () => {
        if (!title || !content) {
            toast({
                variant: 'destructive',
                title: 'Input not provided',
                description: 'Title and content should not be left empty',
                className: 'rounded font-work border',
            });
            return;
        }

        setLoading(true);
        try {
            await axios.post(`${apiURL}/course/admin/courses`, { title, content });
            toast({
                title: 'Course created',
                description: `${title} has been created successfully. Make sure to publish it.`,
                className: 'rounded font-work border bg-green-500',
            });
            navigate('/courses');
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                title: 'Failed to create a course',
                className: 'rounded font-work border',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto font-work">
            <h1 className="font-bold lg:text-6xl mb-4">Create a New Course</h1>
            <div className="space-y-4">
                <div>
                    <Label className="text-sm font-medium">Course Title</Label>
                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter title..."
                    />
                </div>
                <div>
                    <Label className="text-sm font-medium">Course Content</Label>
                    <QuillEditor value={content} onChange={setContent} />
                </div>
                <Button
                    className="text-center rounded shadow min-w-32"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Course'}
                </Button>
            </div>
        </div>
    );
};

export default AddCourse;
