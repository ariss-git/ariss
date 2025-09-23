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

export interface RichCourseEditorProps {
    initialMarkdown?: string;
    onSave: (markdown: string) => void;
}

export default function AddCourse({ initialMarkdown = '', onSave }: RichCourseEditorProps) {
    const [body, setBody] = useState<string>(initialMarkdown);

    return (
        <div className="p-6 max-w-full mx-auto h-screen">
            <MDXEditor
                markdown={body}
                onChange={setBody}
                contentEditableClassName="prose max-w-none overflow-auto fixed"
                className="border-b border-l border-r rounded h-full w-full"
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

            <Button onClick={() => onSave(body)} className="rounded my-4">
                Submit
            </Button>
        </div>
    );
}
