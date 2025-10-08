import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '../../../hooks/use-toast';
import { registerDealerCustomer, AddDealerCustomer } from '../../../api/customerAPI';
import axios from 'axios';

interface GSTINData {
    taxpayerInfo: {
        pradr: {
            addr: {
                pncd: string;
                stcd: string;
                dst: string;
                loc: string;
                bnm: string;
                locality: string;
            };
        };
        tradeNam: string;
    };
}

const AddDealer = () => {
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [fullname, setFullname] = useState('');
    const [gstin, setGstin] = useState('');

    const [gstinData, setGstinData] = useState<GSTINData | null>(null);

    // Shipping Address
    const [pncd, setPncd] = useState('');
    const [stcd, setStcd] = useState('');
    const [dst, setDst] = useState('');
    const [loc, setLoc] = useState('');
    const [adr, setAdr] = useState('');

    // OTP
    const [otp, setOTP] = useState('');

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!gstin) return;

        const timeout = setTimeout(() => {
            fetchGSTIN();
        }, 600);

        async function fetchGSTIN() {
            try {
                const response = await axios.get(
                    `https://appyflow.in/api/verifyGST?gstNo=${gstin}&key_secret=${
                        import.meta.env.VITE_GST_API_KEY
                    }`
                );
                setGstinData(response.data);
                console.log(response.data);
            } catch (error) {
                console.log('Error fetching GSTIN', error);
            }
        }

        return () => clearTimeout(timeout);
    }, [gstin]);

    const shippingAddress = {
        pncd,
        loc,
        dst,
        stcd,
        adr,
    };

    const billingAddress = {
        pncd: gstinData?.taxpayerInfo.pradr.addr.pncd!,
        loc: gstinData?.taxpayerInfo.pradr.addr.loc!,
        dst: gstinData?.taxpayerInfo.pradr.addr.dst!,
        stcd: gstinData?.taxpayerInfo.pradr.addr.stcd!,
        adr: `${gstinData?.taxpayerInfo.pradr.addr.locality!}`,
    };

    const payload: AddDealerCustomer = {
        email,
        phone,
        fullname,
        gstin,
        business: gstinData?.taxpayerInfo.tradeNam!,
        shippingAddress,
        billingAddress,
        otp,
    };

    const addDealer = async () => {
        setLoading(true);

        try {
            const res = await registerDealerCustomer(payload);
            console.log('Dealer user registered', res.data);
            toast({
                description: 'Dealer user registered.',
                className: 'font-work',
            });
            navigate('/customers/dealers/not-approved');
        } catch (error) {
            toast({
                variant: 'destructive',
                description: 'Dealer registration failed.',
                className: 'font-work',
            });
        } finally {
            setLoading(false);
            console.log(payload);
        }
    };

    return (
        <div className="flex justify-start items-start w-full lg:p-10 font-work">
            <div className="flex justify-start items-start w-full flex-col lg:gap-y-8">
                <div className="flex justify-start items-start flex-col lg:gap-y-2 w-full">
                    <Label>Email</Label>
                    <Input
                        placeholder="Enter Email Address"
                        className="shadow rounded max-w-[280px] border"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="flex justify-start items-start flex-col lg:gap-y-2 w-full">
                    <Label>Mobile</Label>
                    <Input
                        placeholder="Enter Mobile Number"
                        className="shadow rounded max-w-[280px] border"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </div>

                <div className="flex justify-start items-start flex-col lg:gap-y-2 w-full">
                    <Label>Full Name</Label>
                    <Input
                        placeholder="Enter Full Name"
                        className="shadow rounded max-w-[280px] border"
                        value={fullname}
                        onChange={(e) => setFullname(e.target.value)}
                    />
                </div>

                <div className="flex justify-start items-start flex-col lg:gap-y-2 w-full">
                    <Label>GSTIN</Label>
                    <Input
                        placeholder="Enter GST Number"
                        className="shadow rounded max-w-[280px] border"
                        value={gstin}
                        onChange={(e) => setGstin(e.target.value)}
                    />
                </div>

                <div className="flex justify-start items-start flex-col lg:gap-y-2 w-full">
                    <Label>Shipping Address</Label>
                    <div className="flex items-center lg:gap-x-10">
                        <Input
                            placeholder="Pincode"
                            className="shadow rounded max-w-[280px] border"
                            value={pncd}
                            onChange={(e) => setPncd(e.target.value)}
                        />
                        <Input
                            placeholder="State"
                            className="shadow rounded max-w-[280px] border"
                            value={stcd}
                            onChange={(e) => setStcd(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center lg:gap-x-10">
                        <Input
                            placeholder="City"
                            className="shadow rounded max-w-[280px] border"
                            value={dst}
                            onChange={(e) => setDst(e.target.value)}
                        />
                        <Input
                            placeholder="Local Area"
                            className="shadow rounded max-w-[280px] border"
                            value={loc}
                            onChange={(e) => setLoc(e.target.value)}
                        />
                    </div>
                    <Input
                        placeholder="Full Address"
                        className="shadow rounded max-w-[410px] border"
                        value={adr}
                        onChange={(e) => setAdr(e.target.value)}
                    />
                </div>

                <div className="flex justify-start items-start flex-col lg:gap-y-2 w-full">
                    <Label>Verify OTP</Label>
                    <Input
                        placeholder="6 digit OTP"
                        className="shadow rounded max-w-[280px] border"
                        value={otp}
                        onChange={(e) => setOTP(e.target.value)}
                    />
                </div>

                <div className="flex justify-center items-center gap-x-4">
                    <Button onClick={addDealer} className="px-6 py-2 shadow rounded">
                        {/* {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit'} */}
                        Submit
                    </Button>
                    <Button className="px-6 py-2 shadow rounded">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send OTP'}
                    </Button>
                    <Button variant={'outline'} className="px-6 py-2 shadow rounded">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Resend OTP'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AddDealer;
