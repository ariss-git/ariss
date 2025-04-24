// src/pages/SubCategory/AddSubCategory.tsx

import { Loader2 } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { useEffect, useState } from 'react';
import { useToast } from '../../hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { dealerNamesDiscount, productNamesDiscount, assignDiscount } from '../../api/discountAPI';

type Product = {
    product_id: string;
    product_title: string;
};

type Dealer = {
    dealer_id: string;
    business_name: string;
    first_name: string;
    last_name: string;
};

const AddDiscount = () => {
    const [dealers, setDealers] = useState<Dealer[]>([]);
    const [selectedDealerId, setSelectedDealerId] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProductId, setSelectedProductId] = useState('');
    const [discountType, setDiscountType] = useState('');
    const [amount, setAmount] = useState('');
    const [percentage, setPercentage] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [loading, setLoading] = useState(false);

    const { toast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDealers = async () => {
            try {
                const response = await dealerNamesDiscount();
                setDealers(response.data.data);
            } catch (error) {
                console.error(error);
                toast({
                    variant: 'destructive',
                    description: 'Failed to fetch dealers.',
                    className: 'rounded font-work shadow-xl',
                });
            }
        };
        fetchDealers();
    }, [toast]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await productNamesDiscount();
                setProducts(response.data.data);
            } catch (error) {
                console.error(error);
                toast({
                    variant: 'destructive',
                    description: 'Failed to fetch products.',
                    className: 'rounded font-work shadow-xl',
                });
            }
        };
        fetchProducts();
    }, [toast]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedDealerId || !selectedProductId || !discountType || !expiryDate) {
            return toast({
                variant: 'destructive',
                description: 'Please fill all required fields.',
                className: 'rounded font-work shadow-xl',
            });
        }

        if (discountType === 'PERCENTAGE' && !percentage) {
            return toast({
                variant: 'destructive',
                description: 'Percentage is required for discount type PERCENTAGE.',
                className: 'rounded font-work shadow-xl',
            });
        }

        if (discountType === 'AMOUNT' && !amount) {
            return toast({
                variant: 'destructive',
                description: 'Amount is required for discount type AMOUNT.',
                className: 'rounded font-work shadow-xl',
            });
        }

        setLoading(true);

        try {
            await assignDiscount({
                dealer_id: selectedDealerId,
                product_id: selectedProductId,
                discount_type: discountType,
                expiry_date: expiryDate,
                amount: discountType === 'AMOUNT' ? Number(amount) : 0, // Ensure amount is a number
                percentage: discountType === 'PERCENTAGE' ? Number(percentage) : 0, // Ensure percentage is a number
            });

            toast({
                className: 'rounded font-work shadow-xl bg-green-500 text-white',
                description: 'Discount assigned successfully!',
            });

            setTimeout(() => navigate('/discount/add'), 1000);
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                description: 'Failed to assign discount.',
                className: 'rounded font-work shadow-xl',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col lg:gap-y-6 justify-start w-full h-full lg:p-12 bg-transparent lg:px-4 lg:py-8">
            <h1 className="font-work text-left text-6xl font-semibold capitalize dark:text-stone-100 text-stone-800">
                Assign Discount:
            </h1>

            <form onSubmit={handleSubmit} className="flex flex-col lg:gap-y-6 lg:mt-4">
                {/* Dealer Select */}
                <div className="flex justify-start items-center w-full lg:gap-x-52">
                    <div className="flex flex-col lg:gap-y-3 font-work capitalize dark:text-stone-100 text-stone-800">
                        <Label>
                            Dealers <sup className="opacity-50">*</sup>
                        </Label>
                        <Select value={selectedDealerId} onValueChange={setSelectedDealerId}>
                            <SelectTrigger className="lg:w-[250px] rounded">
                                <SelectValue placeholder="Select dealer" />
                            </SelectTrigger>
                            <SelectContent>
                                {dealers.map((dealer) => (
                                    <SelectItem key={dealer.dealer_id} value={dealer.dealer_id}>
                                        {dealer.first_name} {dealer.last_name} - {dealer.business_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Product Select */}
                    <div className="flex flex-col lg:gap-y-3 font-work capitalize dark:text-stone-100 text-stone-800">
                        <Label>
                            Products <sup className="opacity-50">*</sup>
                        </Label>
                        <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                            <SelectTrigger className="lg:w-[250px] rounded">
                                <SelectValue placeholder="Select product" />
                            </SelectTrigger>
                            <SelectContent>
                                {products.map((product) => (
                                    <SelectItem key={product.product_id} value={product.product_id}>
                                        {product.product_title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex justify-start items-center w-full lg:gap-x-52">
                    {/* Discount Type Select */}
                    <div className="flex flex-col lg:gap-y-3 font-work capitalize dark:text-stone-100 text-stone-800">
                        <Label>
                            Discount Type <sup className="opacity-50">*</sup>
                        </Label>
                        <Select value={discountType} onValueChange={setDiscountType}>
                            <SelectTrigger className="lg:w-[250px] rounded">
                                <SelectValue placeholder="Select discount type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PERCENTAGE">% Percentage</SelectItem>
                                <SelectItem value="AMOUNT">₹ Amount</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Conditional Fields */}
                    {discountType === 'PERCENTAGE' && (
                        <div className="flex flex-col lg:gap-y-3 font-work capitalize dark:text-stone-100 text-stone-800">
                            <Label>
                                Percentage <sup className="opacity-50">*</sup>
                            </Label>
                            <Input
                                type="number"
                                step="0.01"
                                value={percentage}
                                onChange={(e) => setPercentage(e.target.value)}
                                placeholder="Enter percentage"
                                className="rounded lg:w-[250px]"
                            />
                        </div>
                    )}
                    {discountType === 'AMOUNT' && (
                        <div className="flex flex-col lg:gap-y-3 font-work capitalize dark:text-stone-100 text-stone-800">
                            <Label>
                                Amount <sup className="opacity-50">*</sup>
                            </Label>
                            <Input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="Enter amount"
                                className="rounded lg:w-[250px]"
                            />
                        </div>
                    )}
                </div>
                {/* Expiry Date */}
                <div className="flex flex-col lg:gap-y-3 font-work capitalize dark:text-stone-100 text-stone-800">
                    <Label>
                        Expiry Date <sup className="opacity-50">*</sup>
                    </Label>
                    <Input
                        type="text"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        placeholder="YYYY-MM-DD"
                        className="rounded lg:w-[250px]"
                    />
                </div>

                <Button
                    type="submit"
                    className="lg:px-6 lg:py-2 rounded font-work lg:max-w-[250px]"
                    disabled={loading}
                >
                    {loading ? <Loader2 className="animate-spin" /> : 'Submit'}
                </Button>
            </form>
        </div>
    );
};

export default AddDiscount;
