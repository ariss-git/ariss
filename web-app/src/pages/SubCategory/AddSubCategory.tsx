// src/pages/SubCategory/AddSubCategory.tsx
import { Clipboard, Loader2 } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { useEffect, useState } from 'react';
import { useToast } from '../../hooks/use-toast';
import { addSubcategory, getCategoryNames } from '../../api/subCategoryAPI';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

type Category = {
    category_id: string;
    category_name: string;
};

const AddSubcategory = () => {
    const [subcategoryName, setSubcategoryName] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [pasteImage, setPasteImage] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [selectedCategoryName, setSelectedCategoryName] = useState('');
    const [loading, setLoading] = useState(false);

    const { toast } = useToast();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getCategoryNames();
                setCategories(response.data.data);
            } catch (error) {
                console.error(error);
                toast({
                    variant: 'destructive',
                    description: 'Failed to fetch categories.',
                    className: 'rounded font-work shadow-xl',
                });
            }
        };

        fetchCategories();
    }, [toast]);

    const handleClipboardPaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setPasteImage(text);
            toast({
                description: 'Pasted URL from clipboard.',
                className: 'rounded font-work shadow-xl',
            });
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                description: 'Failed to read clipboard.',
                className: 'rounded font-work shadow-xl',
            });
        }
    };

    const uploadToCloudinary = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

        const res = await fetch(
            `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
            {
                method: 'POST',
                body: formData,
            }
        );

        if (!res.ok) throw new Error('Cloudinary upload failed');

        const data = await res.json();
        return data.secure_url;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!subcategoryName.trim()) {
            return toast({
                variant: 'destructive',
                description: 'Subcategory Name is required.',
                className: 'rounded font-work shadow-xl',
            });
        }

        if (!selectedCategoryName) {
            return toast({
                variant: 'destructive',
                description: 'Select a category.',
                className: 'rounded font-work shadow-xl',
            });
        }

        if (!image && !pasteImage) {
            return toast({
                variant: 'destructive',
                description: 'Provide either an image file or a pasted image URL.',
                className: 'rounded font-work shadow-xl',
            });
        }

        if (image && pasteImage) {
            return toast({
                variant: 'destructive',
                description: 'Cannot use both file and pasted image URL.',
                className: 'rounded font-work shadow-xl',
            });
        }

        setLoading(true);

        try {
            let subcategoryImage = pasteImage;

            if (image) {
                subcategoryImage = await uploadToCloudinary(image);
            }

            await addSubcategory(selectedCategoryName, subcategoryName, subcategoryImage);

            toast({
                className: 'rounded font-work shadow-xl bg-green-500 text-white',
                description: 'Subcategory added successfully.',
            });
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                description: 'There was an error adding subcategory...',
                className: 'rounded font-work shadow-xl',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col lg:gap-y-6 justify-start w-full h-full lg:p-12 bg-transparent lg:px-4 lg:py-8">
            <h1 className="font-work text-left text-6xl font-semibold capitalize dark:text-stone-100 text-stone-800">
                Add a Subcategory:
            </h1>

            <form
                onSubmit={handleSubmit}
                className="flex justify-start items-start flex-col lg:gap-y-6 lg:mt-4"
            >
                <div className="flex flex-col lg:gap-y-3 font-work capitalize dark:text-stone-100 text-stone-800">
                    <Label>
                        Category <sup className="opacity-50">*</sup>
                    </Label>
                    <Select
                        value={selectedCategoryId}
                        onValueChange={(value) => {
                            setSelectedCategoryId(value);
                            const selected = categories.find((cat) => cat.category_id === value);
                            setSelectedCategoryName(selected?.category_name || '');
                        }}
                    >
                        <SelectTrigger className="lg:w-[250px] rounded">
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((cat) => (
                                <SelectItem key={cat.category_id} value={cat.category_id}>
                                    {cat.category_name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex flex-col lg:gap-y-3 font-work capitalize dark:text-stone-100 text-stone-800">
                    <Label>
                        Subcategory name <sup className="opacity-50">*</sup>
                    </Label>
                    <Input
                        type="text"
                        value={subcategoryName}
                        onChange={(e) => setSubcategoryName(e.target.value)}
                        placeholder="300N Router"
                        className="rounded lg:w-[250px]"
                    />
                </div>

                <div className="flex flex-col lg:gap-y-3 font-work capitalize dark:text-stone-100 text-stone-800">
                    <Label>
                        Subcategory Image <sup className="opacity-50">*</sup>
                    </Label>
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files?.[0] || null)}
                        className="cursor-pointer rounded lg:w-[250px]"
                    />

                    <div className="flex items-center lg:gap-x-2 mt-2">
                        <Input
                            type="text"
                            value={pasteImage}
                            onChange={(e) => setPasteImage(e.target.value)}
                            placeholder="Paste image URL here (Optional)"
                            className="placeholder:capitalize rounded lg:w-[250px]"
                        />
                        <Button
                            type="button"
                            onClick={handleClipboardPaste}
                            variant="outline"
                            className="rounded p-2"
                        >
                            <Clipboard size={18} className="text-stone-500 dark:text-stone-100 stroke-[1]" />
                        </Button>
                    </div>
                </div>

                <Button type="submit" className="lg:px-6 lg:py-2 rounded font-work" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin" /> : 'Submit'}
                </Button>
            </form>
        </div>
    );
};

export default AddSubcategory;
