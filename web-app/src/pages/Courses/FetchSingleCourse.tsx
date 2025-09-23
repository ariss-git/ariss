import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSingleCourse, updateCourse } from '../../api/courseAPI';
import {
    MDXEditor,
    headingsPlugin,
    listsPlugin,
    linkPlugin,
    linkDialogPlugin,
    imagePlugin,
    tablePlugin,
    codeBlockPlugin,
    markdownShortcutPlugin,
    toolbarPlugin,
    BlockTypeSelect,
    BoldItalicUnderlineToggles,
    CreateLink,
    InsertImage,
    InsertTable,
    Separator,
    ListsToggle,
    HighlightToggle,
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Loader } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

interface Course {
    course_id: string;
    title: string;
    content: {
        body: string;
    };
    createdAt: string;
}

const EditCourse = () => {
    const { course_id } = useParams();
    const [course, setCourse] = useState<Course | null>(null);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [loading, setLoading] = useState(false);

    const { toast } = useToast();

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await getSingleCourse(course_id!);
                setCourse(res.data.data);
                setTitle(res.data.data.title);
                setBody(res.data.data.content.body);
            } catch (err) {
                console.error('Error fetching course', err);
            }
        };
        fetchCourse();
    }, [course_id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !body.trim()) return;
        setLoading(true);
        try {
            const payload = { title, content: { body } };
            await updateCourse(course_id!, payload);
            console.log('Course updated successfully');
            toast({
                title: 'Course updated successfully.',
                className: 'bg-green-500 text-black font-work rounded',
            });
        } catch (err) {
            console.error('Error updating course', err);
            toast({
                title: 'Course updated failed.',
                className: 'bg-red-500 text-black font-work rounded',
            });
        } finally {
            setLoading(false);
        }
    };

    if (!course)
        return (
            <div className="flex justify-center items-center w-full min-h-screen">
                <Loader className="w-8 h-8 animate-spin" />
            </div>
        );

    return (
        <form onSubmit={handleSubmit} className="p-6 max-w-full mx-auto flex flex-col gap-y-4">
            <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Course Title"
                className="rounded px-2 py-4 placeholder:text-muted-foreground/60"
            />

            <MDXEditor
                markdown={body}
                onChange={setBody}
                contentEditableClassName="prose max-w-none overflow-auto relative"
                className="border-b border-l border-r rounded h-[70vh] w-full overflow-auto"
                plugins={[
                    headingsPlugin(),
                    listsPlugin(),
                    linkPlugin(),
                    linkDialogPlugin(),
                    imagePlugin(),
                    tablePlugin(),
                    codeBlockPlugin({ defaultCodeBlockLanguage: 'js' }),
                    markdownShortcutPlugin(),
                    toolbarPlugin({
                        toolbarContents: () => (
                            <>
                                <BlockTypeSelect />
                                <BoldItalicUnderlineToggles />
                                <Separator />
                                <CreateLink />
                                <InsertImage />
                                <InsertTable />
                                <ListsToggle />
                                <HighlightToggle />
                            </>
                        ),
                    }),
                ]}
            />

            <Button type="submit" className="rounded my-4 w-min">
                {loading ? <Loader className="w-4 h-4 animate-spin" /> : 'Update Course'}
            </Button>
        </form>
    );
};

export default EditCourse;
