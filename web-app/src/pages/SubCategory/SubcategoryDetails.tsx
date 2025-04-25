import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from '../../hooks/use-toast';
import { fetchSingleSubcategory, updateSubcategory } from '../../api/subCategoryAPI';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Clipboard, Loader2 } from 'lucide-react';

interface Subcategory {
    subcategory_id: string;
    subcategory_name: string;
    subcategory_image: string;
    category: {
        category_name: string;
    };
}

const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

const SubcategoryDetails = () => {
    const { subcategory_id } = useParams();
    const [subcategory, setSubcategory] = useState<Subcategory | null>(null);
    const [loading, setLoading] = useState(false);
    const [subcategoryName, setSubcategoryName] = useState('');
    const [subcategoryImage, setSubcategoryImage] = useState('');

    useEffect(() => {
        const fetchData = async (id: string) => {
            setLoading(true);
            try {
                const response = await fetchSingleSubcategory(id);
                const sub = response?.data?.data?.[0];
                if (!sub) throw new Error('No subcategory data found.');

                setSubcategory(sub);
                setSubcategoryName(sub.subcategory_name);
                setSubcategoryImage(sub.subcategory_image);
            } catch (error) {
                console.error(error);
                toast({
                    variant: 'destructive',
                    description: 'Failed to load subcategory data.',
                    className: 'rounded shadow-md border font-work',
                });
            } finally {
                setLoading(false);
            }
        };

        if (subcategory_id) {
            fetchData(subcategory_id);
        }
    }, [subcategory_id]);

    const handleClipboardPaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (text) {
                setSubcategoryImage(text);
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
            console.error(err);
            toast({
                variant: 'destructive',
                description: 'Failed to read clipboard.',
                className: 'rounded shadow-md border font-work',
            });
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
                setSubcategoryImage(data.secure_url);
                toast({
                    title: 'Image uploaded successfully!',
                    description: 'Click update to save changes',
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

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await updateSubcategory(subcategory_id as string, subcategoryName, subcategoryImage);
            setSubcategory(res.data.data);
            toast({
                description: 'Subcategory updated successfully!',
                className: 'rounded shadow-md border font-work bg-green-500',
            });
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                description: 'Error while updating subcategory.',
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
            <div className="flex justify-between items-center w-full lg:mb-10">
                <form
                    onSubmit={handleUpdate}
                    className="flex justify-start items-start flex-col lg:gap-y-6 lg:mt-4 lg:mb-10"
                >
                    <div className="flex flex-col gap-y-3 font-work capitalize dark:text-stone-100 text-stone-800">
                        <Label>Subcategory ID</Label>
                        <Input
                            type="text"
                            value={subcategory?.subcategory_id ?? ''}
                            placeholder="Subcategory ID"
                            className="rounded lg:w-[250px]"
                            disabled
                        />
                    </div>

                    <div className="flex flex-col lg:gap-y-3 font-work capitalize dark:text-stone-100 text-stone-800">
                        <Label>Subcategory Name</Label>
                        <Input
                            type="text"
                            value={subcategoryName}
                            onChange={(e) => setSubcategoryName(e.target.value)}
                            className="rounded lg:w-[250px]"
                        />
                    </div>

                    <div className="flex flex-col lg:gap-y-3 font-work capitalize dark:text-stone-100 text-stone-800">
                        <Label>Subcategory Image</Label>
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
                                value={subcategoryImage}
                                onChange={(e) => setSubcategoryImage(e.target.value)}
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

                        <div className="mt-4 flex flex-col gap-y-3 font-work capitalize dark:text-stone-100 text-stone-800">
                            <Label>Category Name</Label>
                            <Input
                                type="text"
                                value={subcategory?.category?.category_name ?? ''}
                                placeholder="Category"
                                className="rounded lg:w-[250px]"
                                disabled
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="mt-4 w-fit px-6 py-2 font-semibold rounded shadow bg-stone-800 text-white hover:bg-stone-700"
                    >
                        Update Subcategory
                    </Button>
                </form>

                <img
                    src={subcategory?.subcategory_image}
                    alt={subcategory?.subcategory_name}
                    className="object-contain lg:min-h-[400px] lg:max-h-[500px] lg:min-w-[400px] lg:max-w-[500px] shadow-md rounded border lg:mb-10 lg:mr-20"
                />
            </div>
        </div>
    );
};

export default SubcategoryDetails;
