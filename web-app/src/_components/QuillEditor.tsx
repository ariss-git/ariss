import React, { useRef, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

type QuillEditorProps = {
    value: string;
    onChange: (value: string) => void;
};

const QuillEditor: React.FC<QuillEditorProps> = ({ value, onChange }) => {
    const quillRef = useRef<ReactQuill>(null);

    const handleImageUpload = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files?.[0];
            if (!file) return;

            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

            try {
                const res = await fetch(
                    `https://api.cloudinary.com/v1_1/${
                        import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
                    }/image/upload`,
                    {
                        method: 'POST',
                        body: formData,
                    }
                );

                const data = await res.json();
                const imageUrl = data.secure_url;

                const editor = quillRef.current?.getEditor();
                const range = editor?.getSelection();

                if (range) {
                    editor?.insertEmbed(range.index, 'image', imageUrl);
                    editor?.setSelection({ index: range.index + 1, length: 0 });
                }
            } catch (err) {
                console.error('Upload failed:', err);
            }
        };
    };

    const modules = {
        toolbar: {
            container: '#custom-toolbar',
        },
    };

    useEffect(() => {
        const uploadButton = document.getElementById('upload-image-btn');
        if (uploadButton) {
            uploadButton.addEventListener('click', handleImageUpload);
        }

        return () => {
            uploadButton?.removeEventListener('click', handleImageUpload);
        };
    }, []);

    return (
        <div className="mt-2 bg-white rounded-xl border border-gray-300">
            {/* Custom Toolbar */}
            <div id="custom-toolbar">
                <span className="ql-formats">
                    <button className="ql-bold" />
                    <button className="ql-italic" />
                    <button className="ql-underline" />
                </span>
                <span className="ql-formats">
                    <select className="ql-header">
                        <option value="1"></option>
                        <option value="2"></option>
                        <option defaultValue=""></option>
                    </select>
                </span>
                <span className="ql-formats">
                    <button className="ql-list" value="ordered" />
                    <button className="ql-list" value="bullet" />
                </span>
                <span className="ql-formats">
                    <button className="ql-link" />
                    <button className="ql-image" />
                    <button id="upload-image-btn">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" x2="12" y1="3" y2="15" />
                        </svg>
                    </button>
                </span>
                <span className="ql-formats">
                    <select className="ql-color" />
                    <select className="ql-background" />
                </span>
                <span className="ql-formats">
                    <button className="ql-clean" />
                </span>
            </div>

            {/* Editor */}
            <ReactQuill ref={quillRef} value={value} onChange={onChange} theme="snow" modules={modules} />
        </div>
    );
};

export default QuillEditor;
