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
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async () => {
        if (!title || !description || !content) {
            toast({
                variant: 'destructive',
                title: 'All fields are required',
                description: 'Title, description, and content must be filled in.',
                className: 'rounded font-work border',
            });
            return;
        }

        setLoading(true);
        try {
            await axios.post(`${apiURL}/course`, {
                title,
                description,
                content,
            });

            toast({
                title: 'Course Created Successfully',
                description: `${title} has been created. Remember to activate it when ready.`,
                className: 'rounded font-work border bg-green-500',
            });

            navigate('/courses'); // Adjust if needed
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                title: 'Failed to create course',
                className: 'rounded font-work border',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto font-work">
            <h1 className="font-bold text-3xl lg:text-2xl mb-6">Create a New Course</h1>

            <div className="space-y-6">
                <div>
                    <Label className="text-sm font-medium">Course Title</Label>
                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter course title..."
                    />
                </div>

                <div>
                    <Label className="text-sm font-medium">Course Description</Label>
                    <Input
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter a short course description..."
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
