import { Loader2 } from 'lucide-react';
import { getSingleProduct } from '../../api/productAPI';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '../../components/ui/carousel';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

interface Product {
    product_id: string;
    product_title: string;
    product_description: string;
    product_type: string;
    product_label: string;
    product_visibility: string;
    product_warranty: string;
    product_usps: string;
    product_sku: string;
    product_image: string[];
    product_keywords: string[];
    product_price: number;
    product_quantity: number;
    createdAt: string;
    category?: { category_name: string };
    subcategory?: { subcategory_name: string };
}

const FetchSingleProduct = () => {
    const { product_id } = useParams();
    const [data, setData] = useState<Product | null>(null);
    const [loading, setLoading] = useState(false);

    const handleFetch = async (product_id: string) => {
        setLoading(true);
        try {
            const response = await getSingleProduct(product_id);
            setData(response.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (product_id) handleFetch(product_id);
    }, [product_id]);

    if (loading && !data) {
        return (
            <div className="flex justify-center items-center w-full min-h-screen">
                <Loader2 className="w-20 h-20 stroke-[1] text-stone-800 dark:text-stone-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex justify-start items-start w-full lg:p-10 font-work">
            <form className="flex justify-start items-start w-full flex-col lg:gap-y-10">
                <div className="flex justify-start items-center lg:gap-x-52 w-full">
                    <div className="flex justify-start items-start flex-col lg:gap-y-10">
                        <div className="flex justify-start items-start flex-col gap-y-2">
                            <Label>Product ID</Label>
                            <Input
                                value={data?.product_id}
                                disabled
                                className="w-[320px] shadow rounded border"
                            />
                        </div>
                        <div className="flex justify-start items-start flex-col gap-y-2">
                            <Label>Product Name</Label>
                            <Input value={data?.product_title} className="w-[320px] shadow rounded border" />
                        </div>
                        <div className="flex justify-start items-start flex-col gap-y-2">
                            <Label>Product Price</Label>
                            <Input
                                value={`₹ ${data?.product_price}`}
                                className="w-[320px] shadow rounded border"
                            />
                        </div>
                        <div className="flex justify-start items-start flex-col gap-y-2">
                            <Label>Category</Label>
                            <Input
                                disabled
                                value={data?.category?.category_name}
                                className="w-[320px] shadow rounded border"
                            />
                        </div>
                        <div className="flex justify-start items-start flex-col gap-y-2">
                            <Label>Subcategory</Label>
                            <Input
                                disabled
                                value={data?.subcategory?.subcategory_name}
                                className="w-[320px] shadow rounded border"
                            />
                        </div>
                    </div>
                    <div className="flex justify-start items-start w-full flex-col lg:gap-y-10">
                        {data && data.product_image?.length > 0 && (
                            <div className="w-full max-w-xs mt-6">
                                <Label>Product Images</Label>
                                <Carousel>
                                    <CarouselContent>
                                        {data?.product_image.map((imageUrl, index) => (
                                            <CarouselItem key={index}>
                                                <div className="p-1">
                                                    <Card>
                                                        <CardContent className="flex aspect-square items-center justify-center p-2">
                                                            <img
                                                                src={imageUrl}
                                                                alt={`Product ${index + 1}`}
                                                                className="object-contain max-h-[300px] max-w-full rounded"
                                                            />
                                                        </CardContent>
                                                    </Card>
                                                </div>
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    <CarouselPrevious />
                                    <CarouselNext />
                                </Carousel>
                            </div>
                        )}
                        <div className="flex justify-start items-start flex-col gap-y-2">
                            <Label>Product Description</Label>
                            <Input
                                disabled
                                value={data?.product_description}
                                className="w-[320px] h-[200px] shadow rounded border"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-start items-start flex-col gap-y-2">
                    <Label>Product Quantity</Label>
                    <Input value={data?.product_quantity} className="w-[320px] shadow rounded border" />
                </div>
                <div className="flex justify-start items-start flex-col gap-y-2">
                    <Label>
                        Product Warranty <span className="text-stone-500">(in years)</span>
                    </Label>
                    <Input value={data?.product_warranty} className="w-[320px] shadow rounded border" />
                </div>
                <div className="flex justify-start items-start flex-col gap-y-2">
                    <Label>Product Label</Label>
                    <Input value={data?.product_label} className="w-[320px] shadow rounded border" />
                </div>
                <div className="flex justify-start items-start flex-col gap-y-2">
                    <Label>Product Type</Label>
                    <Input value={data?.product_type} className="w-[320px] shadow rounded border" />
                </div>
                <div className="flex justify-start items-start flex-col gap-y-2">
                    <Label>Release Date</Label>
                    <Input
                        value={data?.createdAt.split('T')[0]}
                        className="w-[320px] shadow rounded border"
                    />
                </div>
                <Button className="shadow rounded">Update Product</Button>
            </form>
        </div>
    );
};

export default FetchSingleProduct;
