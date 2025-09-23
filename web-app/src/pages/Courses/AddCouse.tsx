import { useState } from 'react';
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
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { addCourse } from '../../api/courseAPI';
import { Loader } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export interface RichCourseEditorProps {
    initialMarkdown?: string;
    onSave?: (markdown: string) => void;
}

export default function AddCourse({ initialMarkdown = '', onSave }: RichCourseEditorProps) {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState<string>(initialMarkdown);
    const [loading, setLoading] = useState(false);

    const { toast } = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !body.trim()) return;
        setLoading(true);
        try {
            const payload = {
                title,
                content: {
                    body,
                },
            };
            const res = await addCourse(payload);
            console.log('Course added:', res.data);
            onSave?.(body);
            setTitle('');
            setBody('');
            toast({
                title: 'Course added successfully.',
                className: 'bg-green-500 text-black font-work rounded',
            });
            navigate('/courses');
        } catch (error) {
            console.error('Error adding course', error);
            toast({
                title: 'Error adding course.',
                className: 'bg-red-500 text-black font-work rounded',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="p-6 max-w-full mx-auto h-screen flex justify-start items-start flex-col gap-y-4"
        >
            <Input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                placeholder="Course Title"
                className="rounded px-2 py-4 placeholder:text-muted-foreground/60"
            />
            <MDXEditor
                markdown={body}
                onChange={setBody}
                contentEditableClassName="prose max-w-none overflow-auto relative"
                className="border-b border-l border-r rounded h-[70vh] w-full overflow-auto"
                plugins={[
                    // register heading support first
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

            <Button type="submit" className="rounded my-4">
                {loading ? <Loader className="w-4 h-4 animate-spin" /> : 'Submit'}
            </Button>
        </form>
    );
}
