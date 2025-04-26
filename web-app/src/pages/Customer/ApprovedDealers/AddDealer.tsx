import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '../../../hooks/use-toast';

const AddDealer = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="flex justify-start items-start w-full lg:p-10 font-work">
            <form
                className="flex justify-start items-start w-full flex-col lg:gap-y-8"
                onSubmit={(e) => e.preventDefault()}
            >
                <div className="flex justify-start items-start flex-col lg:gap-y-2 w-full">
                    <Label>Mobile</Label>
                    <Input
                        placeholder="Enter Mobile Number"
                        className="shadow rounded max-w-[280px] border"
                    />
                </div>

                <div className="flex justify-start items-start flex-col lg:gap-y-2 w-full">
                    <Label>Email</Label>
                    <Input
                        placeholder="Enter Email Address"
                        className="shadow rounded max-w-[280px] border"
                    />
                </div>
                <div className="flex justify-start items-start flex-col lg:gap-y-2 w-full">
                    <Label>First Name</Label>
                    <Input placeholder="Enter First Name" className="shadow rounded max-w-[280px] border" />
                </div>
                <div className="flex justify-start items-start flex-col lg:gap-y-2 w-full">
                    <Label>Last Name</Label>
                    <Input placeholder="Enter Last Name" className="shadow rounded max-w-[280px] border" />
                </div>
                <div className="flex justify-start items-start flex-col lg:gap-y-2 w-full">
                    <Label>Shipping Address</Label>
                    <div className="flex items-center lg:gap-x-10">
                        <Input placeholder="Pincode" className="shadow rounded max-w-[280px] border" />
                        <Input placeholder="State" className="shadow rounded max-w-[280px] border" />
                    </div>
                    <div className="flex items-center lg:gap-x-10">
                        <Input placeholder="City" className="shadow rounded max-w-[280px] border" />
                        <Input placeholder="Local Area" className="shadow rounded max-w-[280px] border" />
                    </div>
                    <Input placeholder="Full Address" className="shadow rounded max-w-[410px] border" />
                </div>
                <div className="flex justify-start items-start flex-col lg:gap-y-2 w-full">
                    <Label>Billing Address</Label>
                    <div className="flex items-center lg:gap-x-10">
                        <Input placeholder="Pincode" className="shadow rounded max-w-[280px] border" />
                        <Input placeholder="State" className="shadow rounded max-w-[280px] border" />
                    </div>
                    <div className="flex items-center lg:gap-x-10">
                        <Input placeholder="City" className="shadow rounded max-w-[280px] border" />
                        <Input placeholder="Local Area" className="shadow rounded max-w-[280px] border" />
                    </div>
                    <Input placeholder="Full Address" className="shadow rounded max-w-[410px] border" />
                </div>
                <div className="flex justify-start items-start flex-col lg:gap-y-2 w-full">
                    <Label>Usertype</Label>
                    <Input placeholder="DEALER" disabled className="shadow rounded max-w-[280px] border" />
                </div>

                <Button
                    onClick={() => {
                        setLoading(true);
                        toast({
                            title: 'Dealer account created',
                            description:
                                'Dealer account has been created successfully, make sure to approve...',
                            className: 'font-work border rounded shadow bg-green-500',
                        });
                        setTimeout(() => {
                            navigate('/customers/dealers/not-approved');
                        }, 1000);
                    }}
                    className="px-6 py-2 shadow rounded"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit'}
                </Button>
            </form>
        </div>
    );
};

export default AddDealer;
