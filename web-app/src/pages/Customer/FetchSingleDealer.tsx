import { Loader2 } from 'lucide-react';
import { fetchSingleDealer, updateDealer } from '../../api/customerAPI';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { toast } from '../../hooks/use-toast';

interface Address {
    adr: string;
    dst: string;
    loc: string;
    pncd: string;
    stcd: string;
}

interface Dealer {
    dealer_id: string;
    phone: string;
    email: string;
    gstin: string;
    business_name: string;
    first_name: string;
    last_name: string;
    shipping_address: Address;
    billing_address: Address;
    profile_pic: string;
    isApproved: boolean;
    isDistributor: boolean;
    createdAt: string;
}

const SingleDealer = () => {
    const [data, setData] = useState<Dealer | null>(null);
    const [formData, setFormData] = useState<Partial<Dealer>>({});
    const [loading, setLoading] = useState(false);
    const { dealer_id } = useParams();

    useEffect(() => {
        const fetchDealer = async (dealer_id: string) => {
            setLoading(true);
            try {
                const response = await fetchSingleDealer(dealer_id);
                const dealerData = response.data.data;
                setData(dealerData);
                setFormData({
                    ...dealerData,
                });
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (dealer_id) fetchDealer(dealer_id);
    }, [dealer_id]);

    const handleChange = (field: keyof Dealer, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleUpdate = async () => {
        if (!dealer_id || !formData) return;
        setLoading(true);
        try {
            await updateDealer(dealer_id, {
                dealer_id,
                business_name: formData.business_name || '',
                email: formData.email || '',
                gstin: formData.gstin || '',
                phone: formData.phone || '',
                first_name: formData.first_name || '',
                last_name: formData.last_name || '',
                profile_pic: formData.profile_pic || '',
            });
            toast({
                title: 'Dealer Updated',
                description: `${formData.business_name} has been updated successfully.`,
                className: 'font-work border rounded shadow bg-green-500',
            });
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                title: 'Failed to Update',
                description: 'Check logs or try again later.',
                className: 'font-work border rounded shadow',
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading || !data) {
        return (
            <div className="flex justify-center items-center w-full min-h-screen">
                <Loader2 className="w-20 h-20 dark:text-stone-500 text-stone-800 stroke-[1] animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex justify-start items-start w-full lg:p-10 font-work">
            <form
                className="flex justify-start items-start flex-col lg:gap-y-10"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdate();
                }}
            >
                <div className="flex justify-start items-start flex-col gap-y-4">
                    <Label>Business Logo</Label>
                    <img src={data.profile_pic} className="max-w-24 max-h-24" />
                </div>

                <div className="flex flex-col gap-y-2">
                    <Label>Dealer ID</Label>
                    <Input value={data.dealer_id} disabled className="rounded shadow lg:w-[320px]" />
                </div>

                <div className="flex flex-col gap-y-2">
                    <Label>Business Name</Label>
                    <Input
                        value={formData.business_name || ''}
                        onChange={(e) => handleChange('business_name', e.target.value)}
                        className="rounded shadow lg:w-[320px]"
                    />
                </div>

                <div className="flex flex-col gap-y-2">
                    <Label>GSTIN</Label>
                    <Input
                        value={formData.gstin || ''}
                        onChange={(e) => handleChange('gstin', e.target.value)}
                        className="rounded shadow lg:w-[320px]"
                    />
                </div>

                <div className="flex flex-col gap-y-2">
                    <Label>First Name</Label>
                    <Input
                        value={formData.first_name || ''}
                        onChange={(e) => handleChange('first_name', e.target.value)}
                        className="rounded shadow lg:w-[320px]"
                    />
                </div>

                <div className="flex flex-col gap-y-2">
                    <Label>Last Name</Label>
                    <Input
                        value={formData.last_name || ''}
                        onChange={(e) => handleChange('last_name', e.target.value)}
                        className="rounded shadow lg:w-[320px]"
                    />
                </div>

                <div className="flex justify-start items-center w-full lg:gap-x-44 lg:my-6">
                    <div className="flex flex-col gap-y-2">
                        <Label>Shipping Address</Label>
                        <div className="flex gap-x-4">
                            <Input
                                disabled
                                value={data.shipping_address.pncd}
                                className="rounded shadow lg:w-[80px]"
                            />
                            <Input
                                disabled
                                value={data.shipping_address.stcd}
                                className="rounded shadow lg:w-[150px]"
                            />
                        </div>
                        <div className="flex gap-x-4">
                            <Input
                                disabled
                                value={data.shipping_address.dst}
                                className="rounded shadow lg:w-[100px]"
                            />
                            <Input
                                disabled
                                value={data.shipping_address.loc}
                                className="rounded shadow lg:w-[150px]"
                            />
                        </div>
                        <div className="flex">
                            <Input
                                disabled
                                value={data.shipping_address.adr}
                                className="rounded shadow w-min"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-y-2">
                        <Label>Billing Address</Label>
                        <div className="flex gap-x-4">
                            <Input
                                disabled
                                value={data.billing_address.pncd}
                                className="rounded shadow lg:w-[80px]"
                            />
                            <Input
                                disabled
                                value={data.billing_address.stcd}
                                className="rounded shadow lg:w-[150px]"
                            />
                        </div>
                        <div className="flex gap-x-4">
                            <Input
                                disabled
                                value={data.billing_address.dst}
                                className="rounded shadow lg:w-[100px]"
                            />
                            <Input
                                disabled
                                value={data.billing_address.loc}
                                className="rounded shadow lg:w-[250px]"
                            />
                        </div>
                        <div className="flex">
                            <Input
                                disabled
                                value={data.billing_address.adr}
                                className="rounded shadow w-min"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-y-2">
                    <Label>Mobile Number</Label>
                    <Input
                        value={formData.phone || ''}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className="rounded shadow lg:w-[320px]"
                    />
                </div>

                <div className="flex flex-col gap-y-2">
                    <Label>Email</Label>
                    <Input
                        value={formData.email || ''}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className="rounded shadow lg:w-[320px]"
                    />
                </div>

                <div className="flex flex-col gap-y-2">
                    <Label>Approval Status</Label>
                    <Input
                        value={data.isApproved ? 'Approved' : 'Not Approved'}
                        disabled
                        className="rounded shadow lg:w-[320px]"
                    />
                </div>

                <div className="flex flex-col gap-y-2">
                    <Label>Distributor Status</Label>
                    <Input
                        value={data.isDistributor ? 'Approved as Distributor' : 'Not Approved as Distributor'}
                        disabled
                        className="rounded shadow lg:w-[320px]"
                    />
                </div>

                <div className="flex flex-col gap-y-2">
                    <Label>Registration Date</Label>
                    <Input
                        disabled
                        value={data.createdAt.split('T')[0]}
                        className="rounded shadow lg:w-[320px]"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-black text-white px-6 py-2 mt-4 rounded shadow hover:bg-neutral-800"
                >
                    {loading ? <Loader2 className="animate-spin w-4 h-4" /> : 'Update Dealer'}
                </button>
            </form>
        </div>
    );
};

export default SingleDealer;
