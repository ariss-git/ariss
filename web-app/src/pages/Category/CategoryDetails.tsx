import { toast } from '../../hooks/use-toast';
import { fetchSingleCategory, updateCategory } from '../../api/categoryAPI';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Clipboard, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface Category {
    category_id: string;
    category_name: string;
    category_image: string;
    createdAt: string;
}

const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

const CategoryDetails = () => {
    const { category_id } = useParams();
    const [category, setCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [categoryName, setCategoryName] = useState<string>('');
    const [categoryImage, setCategoryImage] = useState<string>('');

    useEffect(() => {
        const fetchCategory = async (id: string) => {
            setLoading(true);
            try {
                const response = await fetchSingleCategory(id);
                const cat = response.data.data;
                setCategory(cat);
                setCategoryName(cat.category_name);
                setCategoryImage(cat.category_image);
            } catch (error) {
                console.error(error);
                toast({
                    variant: 'destructive',
                    description: 'An error occurred while getting the category...',
                    className: 'rounded shadow-md border font-work',
                });
            } finally {
                setLoading(false);
            }
        };

        if (category_id) {
            fetchCategory(category_id);
        }
    }, [category_id]);

    const handleClipboardPaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (text) {
                setCategoryImage(text);
                toast({
                    description: 'Image URL pasted from clipboard!',
                    className: 'rounded shadow-md border font-work',
                });
            } else {
                toast({
                    variant: 'destructive',
                    description: 'Clipboard is empty.',
                    className: 'rounded shadow-md border font-work',
                });
            }
        } catch (err) {
            toast({
                variant: 'destructive',
                description: 'Failed to read clipboard.',
                className: 'rounded shadow-md border font-work',
            });
            console.error(err);
        }
    };

    const handleFileUpload = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        try {
            toast({
                description: 'Uploading image...',
                className: 'rounded shadow-md border font-work',
            });

            const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (data.secure_url) {
                setCategoryImage(data.secure_url);
                toast({
                    title: 'Image uploaded successfully!',
                    description: 'Click update category change image',
                    className: 'rounded shadow-md border font-work bg-green-500',
                });
            } else {
                throw new Error('Upload failed');
            }
        } catch (err) {
            console.error(err);
            toast({
                variant: 'destructive',
                description: 'Failed to upload image.',
                className: 'rounded shadow-md border font-work',
            });
        }
    };

    const handleUpdate = async (e: React.FormEvent, id: string, name: string, image: string) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await updateCategory(id, name, image);
            setCategory(res.data.data);
            toast({
                description: 'Category updated successfully!',
                className: 'rounded shadow-md border font-work bg-green-500',
            });
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                description: 'An error occurred while updating...',
                className: 'rounded shadow-md border font-work',
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:gap-y-6 justify-start w-full h-full lg:p-12 bg-transparent lg:px-4 lg:py-8">
            <h1 className="font-work text-left text-6xl font-semibold capitalize dark:text-stone-100 text-stone-800">
                Category Details:
            </h1>
            <div className="flex justify-between items-center w-full lg:mb-10">
                <form
                    onSubmit={(e) => handleUpdate(e, category_id as string, categoryName, categoryImage)}
                    className="flex justify-start items-start flex-col lg:gap-y-6 lg:mt-4 lg:mb-10"
                >
                    <div className="flex flex-col lg:gap-y-3 font-work capitalize dark:text-stone-100 text-stone-800">
                        <Label>Category Name</Label>
                        <Input
                            type="text"
                            onChange={(e) => setCategoryName(e.target.value)}
                            value={categoryName}
                            placeholder="Category Name"
                            className="rounded lg:w-[250px]"
                        />
                    </div>

                    <div className="flex flex-col lg:gap-y-3 font-work capitalize dark:text-stone-100 text-stone-800">
                        <Label>Category Image</Label>
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    handleFileUpload(file);
                                }
                            }}
                            className="cursor-pointer rounded lg:w-[250px]"
                        />

                        <div className="flex items-center gap-x-2 mt-2">
                            <Input
                                type="text"
                                value={categoryImage}
                                onChange={(e) => setCategoryImage(e.target.value)}
                                placeholder="Paste image URL here (optional)"
                                className="rounded lg:w-[250px]"
                            />
                            <Button
                                type="button"
                                onClick={handleClipboardPaste}
                                variant="outline"
                                className="rounded p-2"
                            >
                                <Clipboard
                                    size={18}
                                    className="text-stone-500 dark:text-stone-100 stroke-[1]"
                                />
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-col lg:gap-y-3 font-work capitalize dark:text-stone-100 text-stone-800">
                        <Label>Category ID</Label>
                        <Input
                            type="text"
                            value={category?.category_id}
                            placeholder="Category ID"
                            className="rounded lg:w-[250px]"
                            disabled
                        />
                    </div>

                    <div className="flex flex-col lg:gap-y-3 font-work capitalize dark:text-stone-100 text-stone-800">
                        <Label>Category Created Date:</Label>
                        <Input
                            type="text"
                            value={category?.createdAt.split('T')[0] || ''}
                            placeholder="Created At"
                            className="rounded lg:w-[250px]"
                            disabled
                        />
                    </div>

                    <Button
                        type="submit"
                        className="mt-4 w-fit px-6 py-2 font-semibold rounded shadow bg-stone-800 text-white hover:bg-stone-700"
                    >
                        Update Category
                    </Button>
                </form>

                <img
                    src={category?.category_image}
                    alt={category?.category_name}
                    className="object-contain lg:min-h-[400px] lg:max-h-[500px] lg:min-w-[400px] lg:max-w-[500px] shadow-md rounded border lg:mb-10 lg:mr-20"
                />
            </div>
        </div>
    );
};

export default CategoryDetails;
