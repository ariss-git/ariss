// src/pages/AddProduct.tsx
import { Clipboard, Loader2 } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { useEffect, useState } from 'react';
import { useToast } from '../../hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { addProduct, getAllSubcategoriesForProduct } from '../../api/productAPI';
import { getCategoryNames } from '../../api/subCategoryAPI';
import MDEditor from '@uiw/react-md-editor';
import axios from 'axios';

type InputFieldProps<T extends string | number> = {
    label: string;
    value: T;
    onChange: (val: T) => void;
    type?: React.HTMLInputTypeAttribute;
    placeholder?: string;
};

type Category = {
    category_id: string;
    category_name: string;
};

type Subcategory = {
    subcategory_id: string;
    subcategory_name: string;
};

const AddProduct = () => {
    const [productName, setProductName] = useState('');
    const [productSku, setProductSku] = useState('');
    const [productType, setProductType] = useState('');
    const [productLabel, setProductLabel] = useState('');
    const [productWarranty, setProductWarranty] = useState<number>(0);
    const [productQuantity, setProductQuantity] = useState<number>(0);
    const [productVisibility, setProductVisibility] = useState('');
    const [productUsps, setProductUsps] = useState('');
    const [productPrice, setProductPrice] = useState<number>(0);
    const [productKeywords, setProductKeywords] = useState<string[]>([]);
    const [keywordInput, setKeywordInput] = useState('');
    const [imageInput, setImageInput] = useState('');
    const [pastedImageURLs, setPastedImageURLs] = useState<string[]>([]);
    const [productDescription, setProductDescription] = useState('');

    const [categories, setCategories] = useState<Category[]>([]);
    const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState('');

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getCategoryNames();
                setCategories(response.data.data);
            } catch {
                toast({ variant: 'destructive', description: 'Failed to fetch categories.' });
            }
        };

        const fetchSubcategories = async () => {
            try {
                const response = await getAllSubcategoriesForProduct();
                setSubcategories(response.data.data);
            } catch {
                toast({ variant: 'destructive', description: 'Failed to fetch subcategories.' });
            }
        };

        fetchCategories();
        fetchSubcategories();
    }, [toast]);

    const handleClipboardPaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (text) {
                setPastedImageURLs((prev) => [...prev, text]);
                toast({ description: 'Pasted image URL added.' });
            }
        } catch {
            toast({ variant: 'destructive', description: 'Could not read from clipboard.' });
        }
    };

    const handleImageInput = () => {
        const urls = imageInput
            .split(',')
            .map((u) => u.trim())
            .filter((u) => u.length > 0);
        if (urls.length > 0) {
            setPastedImageURLs((prev) => [...prev, ...urls]);
            setImageInput('');
        }
    };

    const handleKeywordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const trimmed = keywordInput.trim();
            if (trimmed && !productKeywords.includes(trimmed)) {
                setProductKeywords((prev) => [...prev, trimmed]);
                setKeywordInput('');
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!productName.trim()) {
            return toast({ variant: 'destructive', description: 'Product name is required.' });
        }

        if (!selectedCategoryId || !selectedSubcategoryId) {
            return toast({ variant: 'destructive', description: 'Category and Subcategory are required.' });
        }

        if (pastedImageURLs.length === 0) {
            return toast({ variant: 'destructive', description: 'At least one image URL is required.' });
        }

        const categoryName =
            categories.find((c) => c.category_id === selectedCategoryId)?.category_name || '';
        const subcategoryName =
            subcategories.find((s) => s.subcategory_id === selectedSubcategoryId)?.subcategory_name || '';

        const payload = {
            product_title: productName,
            product_sku: productSku,
            product_type: productType,
            product_description: productDescription,
            product_image: pastedImageURLs,
            product_warranty: Number(productWarranty),
            product_quantity: Number(productQuantity),
            product_label: productLabel,
            product_visibility: productVisibility,
            product_usps: productUsps,
            product_keywords: productKeywords,
            product_price: Number(productPrice),
            subcategory_name: subcategoryName,
            category_name: categoryName,
        };

        try {
            setLoading(true);
            await addProduct(payload);
            toast({
                title: 'Product added successfully.',
                className: 'bg-green-500 text-white font-work rounded',
            });
            setTimeout(() => navigate('/products'), 1000);
        } catch (err) {
            console.error(err);
            toast({ variant: 'destructive', description: 'Something went wrong while adding the product.' });
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        const uploadedURLs: string[] = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

            try {
                const response = await axios.post(
                    `https://api.cloudinary.com/v1_1/${
                        import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
                    }/image/upload`,
                    formData
                );
                uploadedURLs.push(response.data.secure_url);
            } catch (error) {
                console.error(error);
                toast({
                    variant: 'destructive',
                    description: `Failed to upload image: ${file.name}`,
                });
            }
        }

        if (uploadedURLs.length) {
            setPastedImageURLs((prev) => [...prev, ...uploadedURLs]);
            toast({ description: 'Image(s) uploaded successfully.' });
        }
    };

    return (
        <div className="p-4 md:p-8 lg:p-12 space-y-6 w-full font-work">
            <h1 className="font-work text-left text-6xl font-semibold capitalize dark:text-stone-100 text-stone-800">
                Add a Product:
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex justify-start items-center w-full lg:gap-x-52">
                    <InputField
                        label="Product Name"
                        placeholder="TP-Link 802.1f"
                        value={productName}
                        onChange={setProductName}
                    />
                    <InputField
                        label="Product Price"
                        type="number"
                        value={productPrice}
                        onChange={setProductPrice}
                    />
                </div>
                <div className="flex justify-start items-center w-full lg:gap-x-52">
                    <DropdownField
                        label="Product Category"
                        options={categories.map((c) => ({ label: c.category_name, value: c.category_id }))}
                        value={selectedCategoryId}
                        onChange={setSelectedCategoryId}
                    />
                    <DropdownField
                        label="Product Subcategory"
                        options={subcategories.map((s) => ({
                            label: s.subcategory_name,
                            value: s.subcategory_id,
                        }))}
                        value={selectedSubcategoryId}
                        onChange={setSelectedSubcategoryId}
                    />
                </div>

                <div className="flex justify-start items-center w-full lg:gap-x-52">
                    <InputField
                        label="Product SKU"
                        value={productSku}
                        onChange={setProductSku}
                        placeholder="Enter product SKU (Optional)"
                    />
                    <div className="flex flex-col lg:gap-y-3 font-work capitalize dark:text-stone-100 text-stone-800">
                        <Label>Product Type</Label>
                        <Select
                            value={productVisibility}
                            onValueChange={(value) => setProductVisibility(value)}
                        >
                            <SelectTrigger className="lg:w-[250px] rounded">
                                <SelectValue placeholder="Select visibility for product" />
                            </SelectTrigger>
                            <SelectContent className="font-work">
                                <SelectItem value="Public">Public</SelectItem>
                                <SelectItem value="Hidden">Hidden</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                {/* <InputField label="Product Type" value={productType} onChange={setProductType} /> */}
                <div className="flex justify-start items-center w-full lg:gap-x-52">
                    <div className="flex flex-col lg:gap-y-3 font-work capitalize dark:text-stone-100 text-stone-800">
                        <Label>Product Type</Label>
                        <Select value={productType} onValueChange={(value) => setProductType(value)}>
                            <SelectTrigger className="lg:w-[250px] rounded">
                                <SelectValue placeholder="Select type for product" />
                            </SelectTrigger>
                            <SelectContent className="font-work">
                                <SelectItem value="Normal">Normal</SelectItem>
                                <SelectItem value="Fibre">Fibre</SelectItem>
                                <SelectItem value="Bundle">Bundle</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {/* <InputField label="Product Label" value={productLabel} onChange={setProductLabel} /> */}
                    <div className="flex flex-col lg:gap-y-3 font-work capitalize dark:text-stone-100 text-stone-800">
                        <Label>Product Label</Label>
                        <Select value={productLabel} onValueChange={(value) => setProductLabel(value)}>
                            <SelectTrigger className="lg:w-[250px] rounded">
                                <SelectValue placeholder="Select label for product" />
                            </SelectTrigger>
                            <SelectContent className="font-work">
                                <SelectItem value="New">New</SelectItem>
                                <SelectItem value="Hot">Hot</SelectItem>
                                <SelectItem value="Trending">Trending</SelectItem>
                                <SelectItem value="ComingSoon">Coming Soon</SelectItem>
                                <SelectItem value="OutofStock">Out of Stock</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="flex justify-start items-center w-full lg:gap-x-52">
                    <InputField
                        label="Product Warranty"
                        type="number"
                        value={productWarranty}
                        onChange={setProductWarranty}
                    />
                    <InputField
                        label="Product Quantity"
                        type="number"
                        value={productQuantity}
                        onChange={setProductQuantity}
                    />
                </div>
                <div className="flex justify-start items-center w-full lg:gap-x-52">
                    <InputField
                        label="Product USPs"
                        placeholder="Enter product USPs (Optional)"
                        value={productUsps}
                        onChange={setProductUsps}
                    />

                    {/* Keywords */}
                    <div className="space-y-2">
                        <Label>Keywords</Label>
                        <div className="flex gap-2 flex-wrap">
                            {productKeywords.map((tag, i) => (
                                <span
                                    key={i}
                                    className="text-sm bg-stone-200 dark:bg-stone-600 px-2 py-1 rounded-full"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <Input
                            value={keywordInput}
                            onChange={(e) => setKeywordInput(e.target.value)}
                            onKeyDown={handleKeywordKeyDown}
                            placeholder="Type keyword and press Enter or comma"
                            className="w-[320px] rounded font-work"
                        />
                    </div>
                </div>

                {/* Markdown Description */}
                <div className="space-y-2">
                    <Label>Product Description</Label>
                    <MDEditor
                        value={productDescription}
                        onChange={(val) => setProductDescription(val || '')}
                    />
                </div>

                {/* Image Input */}
                <div className="space-y-2">
                    <Label>Image Gallery</Label>
                    <div className="flex gap-2 flex-wrap">
                        <Input
                            value={imageInput}
                            onChange={(e) => setImageInput(e.target.value)}
                            placeholder="Paste image URLs (comma separated)"
                            className="w-[300px] rounded"
                        />
                        <Button
                            className="rounded"
                            type="button"
                            variant="default"
                            onClick={handleImageInput}
                        >
                            Add
                        </Button>
                        <Button
                            className="rounded"
                            type="button"
                            variant="default"
                            onClick={handleClipboardPaste}
                        >
                            <Clipboard className="w-4 h-4" />
                        </Button>
                    </div>
                    <div className="flex flex-col gap-1 max-h-32 overflow-y-auto">
                        {pastedImageURLs.map((url, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm text-blue-600">
                                <span className="break-words underline">{url}</span>
                            </div>
                        ))}
                    </div>

                    {/* File Upload */}
                    <div className="mt-4">
                        <Label className="mb-2 block">Upload Image(s)</Label>
                        <Input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="w-fit cursor-pointer"
                        />
                    </div>
                </div>

                <Button type="submit" disabled={loading} className="w-[250px] rounded shadow-md">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : 'Add Product'}
                </Button>
            </form>
        </div>
    );
};

const InputField = <T extends string | number>({
    label,
    value,
    onChange,
    placeholder,
    type = 'text',
}: InputFieldProps<T>) => (
    <div className="space-y-2">
        <Label>{label}</Label>
        <Input
            type={type}
            value={value}
            placeholder={placeholder}
            onChange={(e) => {
                const val =
                    type === 'number'
                        ? e.target.value === ''
                            ? ''
                            : Number(e.target.value)
                        : e.target.value;
                onChange(val as T);
            }}
            className="w-[250px] rounded font-work"
        />
    </div>
);

const DropdownField = ({
    label,
    options,
    value,
    onChange,
}: {
    label: string;
    options: { label: string; value: string }[];
    value: string;
    onChange: (val: string) => void;
}) => (
    <div className="space-y-2 font-work rounded">
        <Label>{label}</Label>
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="w-[250px]">
                <SelectValue placeholder={`Select ${label}`} />
            </SelectTrigger>
            <SelectContent className="font-work">
                {options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    </div>
);

export default AddProduct;
