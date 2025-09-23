import { Clipboard, Loader2, PlusCircle } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { useState } from 'react';
import { useToast } from '../../hooks/use-toast';
import { addCategoryAPI } from '../../api/categoryAPI';
import { Dialog, DialogContent, DialogTrigger } from '../../components/ui/dialog';

type AddCategoryProps = {
    onSuccess?: () => void;
};

const AddTest = ({ onSuccess }: AddCategoryProps) => {
    const [name, setName] = useState<string>('');
    const [image, setImage] = useState<File | null>(null);
    const [pasteImage, setPasteImage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const { toast } = useToast();

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

        if (!name.trim()) {
            toast({
                variant: 'destructive',
                className: 'rounded font-work shadow-xl',
                description: 'Category Name is required.',
            });
            return;
        }

        if (!image && !pasteImage) {
            toast({
                variant: 'destructive',
                className: 'rounded font-work shadow-xl',
                description: 'Provide either an image file or a pasted image URL.',
            });
            return;
        }

        if (image && pasteImage) {
            toast({
                variant: 'destructive',
                className: 'rounded font-work shadow-xl',
                description: 'Cannot use both file and pasted image URL.',
            });
            return;
        }

        setLoading(true);

        try {
            let categoryImage = pasteImage;

            if (image) {
                categoryImage = await uploadToCloudinary(image);
            }

            await addCategoryAPI(name, categoryImage);
            toast({
                className: 'rounded font-work shadow bg-green-500 text-white',
                title: 'Category added successfully',
                description: 'Make sure to add subcategories as well...',
            });
            onSuccess?.();
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                className: 'rounded font-work shadow-xl',
                description: 'There was an error adding category...',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col lg:gap-y-6 justify-start w-full h-full bg-transparent">
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="default" className="rounded">
                        Add Question <PlusCircle className="ml-2 h-4 w-4" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="rounded-md shadow max-h-[80%] overflow-y-auto">
                    <form
                        onSubmit={handleSubmit}
                        className="flex justify-start items-start flex-col lg:gap-y-6 lg:mt-4"
                    >
                        <div className="flex justify-start items-start flex-col lg:gap-y-3 font-work capitalize dark:text-stone-100 text-stone-800">
                            <Label>
                                Category name<sup className="opacity-50">*</sup>
                            </Label>
                            <Input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter Category"
                                className="rounded lg:w-[250px]"
                            />
                        </div>

                        <div className="flex justify-start items-start flex-col lg:gap-y-3 font-work capitalize dark:text-stone-100 text-stone-800">
                            <Label>
                                Category Image<sup className="opacity-50">*</sup>
                            </Label>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImage(e.target.files?.[0] || null)}
                                className="cursor-pointer rounded lg:w-[250px]"
                            />

                            <div className="flex justify-start items-center lg:gap-x-2 font-work capitalize dark:text-stone-100 text-stone-800 mt-2">
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
                                    <Clipboard
                                        size={18}
                                        className="text-stone-500 dark:text-stone-100 stroke-[1]"
                                    />
                                </Button>
                            </div>
                        </div>

                        <Button type="submit" className="lg:px-6 lg:py-2 rounded font-work">
                            {loading ? <Loader2 className="animate-spin" /> : 'Submit'}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AddTest;
