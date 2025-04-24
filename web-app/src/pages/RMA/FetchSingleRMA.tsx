import { Input } from '../../components/ui/input';
import { getSingleRMA } from '../../api/rmaAPI';
import { toast } from '../../hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Textarea } from '../../components/ui/textarea';

type RMA = {
    rma_id: string;
    first_name: string;
    last_name: string;
    business_name: string;
    gstin: string;
    user_type: string;
    email: string;
    phone: string;
    status: string;
    product_name: string;
    product_serial: string;
    product_issue: string;
    product_images: string[];
    createdAt: string;
};

const FetchSingleRMA = () => {
    const { rma_id } = useParams();
    const [rmaData, setRMAData] = useState<RMA | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchRMADetails = async (rma_id: string) => {
            if (!rma_id) return;
            setLoading(true);
            try {
                const response = await getSingleRMA(rma_id);
                setRMAData(response.data.data); // Should be a single RMA object
            } catch (error) {
                console.error(error);
                toast({
                    variant: 'destructive',
                    title: 'Failed to load RMA request',
                    description: 'Check logs or try again later...',
                    className: 'rounded font-work shadow border',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchRMADetails(rma_id!);
    }, [rma_id]);

    return (
        <div className="flex justify-start items-start w-full lg:p-10 font-work">
            {loading && !rmaData ? (
                <div className="flex justify-center items-center w-full min-h-screen">
                    <Loader2 className="w-20 h-20 stroke-[1] animate-spin text-stone-800 dark:text-stone-400" />
                </div>
            ) : (
                rmaData && (
                    <div className="flex justify-start items-start flex-col lg:gap-y-8">
                        <div className="flex justify-start items-start lg:gap-x-44">
                            <div className="flex justify-start items-start flex-col gap-y-2">
                                <Label>Name</Label>
                                <Input
                                    value={`${rmaData.first_name} ${rmaData.last_name}`}
                                    className="rounded shadow border cursor-none"
                                />
                            </div>
                            <div className="flex justify-start items-start flex-col gap-y-2">
                                <Label>Business Name</Label>
                                <Input
                                    value={rmaData.business_name}
                                    className="rounded shadow border cursor-none"
                                />
                            </div>
                        </div>
                        <div className="flex justify-start items-start lg:gap-x-44">
                            <div className="flex justify-start items-start flex-col gap-y-2">
                                <Label>GSTIN</Label>
                                <Input value={rmaData.gstin} className="rounded shadow border cursor-none" />
                            </div>
                            <div className="flex justify-start items-start flex-col gap-y-2">
                                <Label>User Type</Label>
                                <Input
                                    value={rmaData.user_type}
                                    className="rounded shadow border cursor-none"
                                />
                            </div>
                        </div>
                        <div className="flex justify-start items-start lg:gap-x-44">
                            <div className="flex justify-start items-start flex-col gap-y-2">
                                <Label>Phone</Label>
                                <Input value={rmaData.phone} className="rounded shadow border cursor-none" />
                            </div>
                            <div className="flex justify-start items-start flex-col gap-y-2">
                                <Label>Email</Label>
                                <Input
                                    value={rmaData.email}
                                    className="rounded shadow border cursor-none w-[220px]"
                                />
                            </div>
                        </div>
                        <div className="flex justify-start items-start lg:gap-x-44">
                            <div className="flex justify-start items-start flex-col gap-y-2">
                                <Label>RMA Status</Label>
                                <Badge className="rounded shadow border cursor-none">{rmaData.status}</Badge>
                            </div>
                        </div>

                        <div className="flex justify-start items-start lg:gap-x-44">
                            <div className="flex justify-start items-start flex-col gap-y-2">
                                <Label>Defected Product</Label>
                                <Input
                                    value={rmaData.product_name}
                                    className="rounded shadow border cursor-none"
                                />
                            </div>
                            <div className="flex justify-start items-start flex-col gap-y-2">
                                <Label>Request Date</Label>
                                <Input
                                    value={rmaData.createdAt.split('T')[0]}
                                    className="rounded shadow border cursor-none"
                                />
                            </div>

                            <div className="flex justify-start items-start flex-col gap-y-2">
                                <Label>Serial Code</Label>
                                <Input
                                    value={rmaData.product_serial}
                                    className="rounded shadow border cursor-none"
                                />
                            </div>
                        </div>

                        <div className="flex justify-start items-start flex-col gap-y-2">
                            <Label>Product Image</Label>
                            <img
                                src={rmaData.product_images[0]}
                                alt="Defective product image"
                                className="object-contain lg:w-[280px] lg:h-[280px] border shadow rounded-lg"
                            />
                        </div>
                        <div className="flex justify-start items-start flex-col gap-y-2">
                            <Label>Product Issue</Label>
                            <Textarea
                                value={rmaData.product_issue}
                                cols={35}
                                rows={5}
                                className="rounded shadow border cursor-none"
                            />
                        </div>
                    </div>
                )
            )}
        </div>
    );
};

export default FetchSingleRMA;
