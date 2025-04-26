import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { addTechnician, sendOTP } from '../../api/authURL';
import { useState } from 'react';
import { toast } from '../../hooks/use-toast';
import { Loader2, ClipboardPaste } from 'lucide-react'; // Imported ClipboardPaste icon
import { useNavigate } from 'react-router-dom';

const AddTechnician = () => {
    const [loading, setLoading] = useState(false);
    const [dealerID, setDealerID] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [otp, setOtp] = useState('');
    const [usertype] = useState('TECHNICIAN');
    const [otpSent, setOtpSent] = useState(false);
    const navigate = useNavigate();

    const handleSendOTP = async () => {
        if (!mobile || !email) {
            toast({
                title: 'Missing Fields',
                description: 'Please fill Mobile and Email before sending OTP',
                className: 'border rounded shadow font-work bg-yellow-500',
            });
            return;
        }
        setLoading(true);
        try {
            await sendOTP(mobile, email);
            toast({
                title: 'OTP Sent!',
                description: 'OTP has been sent to Mobile and Email',
                className: 'border rounded shadow font-work bg-green-500',
            });
            setOtpSent(true);
        } catch (error) {
            console.error(error);
            toast({
                title: 'OTP Failure',
                description: 'Could not send OTP, check logs or try again',
                className: 'border rounded shadow font-work bg-red-500',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRegistration = async () => {
        if (!dealerID || !mobile || !email || !firstName || !lastName || !otp) {
            toast({
                title: 'Incomplete Details',
                description: 'Please fill all fields including OTP',
                className: 'border rounded shadow font-work bg-yellow-500',
            });
            return;
        }

        const data = {
            phone: `+91${mobile}`,
            email,
            first_name: firstName,
            last_name: lastName,
            otp,
            usertype,
            dealerId: dealerID,
        };

        setLoading(true);
        try {
            await addTechnician(data);
            toast({
                title: 'Registration Successful',
                description: 'Technician account created successfully',
                className: 'border rounded shadow font-work bg-green-500',
            });
            setDealerID('');
            setMobile('');
            setEmail('');
            setFirstName('');
            setLastName('');
            setOtp('');
            setOtpSent(false);
            navigate('/customers/techicians');
        } catch (error) {
            console.error(error);
            toast({
                title: 'Registration Failed',
                description: 'Could not create account, check logs or try again',
                className: 'border rounded shadow font-work bg-red-500',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        await handleSendOTP();
    };

    const handlePasteDealerID = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setDealerID(text);
            toast({
                title: 'Pasted from Clipboard',
                description: 'Dealer ID pasted successfully',
                className: 'border rounded shadow font-work bg-green-500',
            });
        } catch (error) {
            console.error(error);
            toast({
                title: 'Clipboard Error',
                description: 'Failed to read clipboard',
                className: 'border rounded shadow font-work bg-red-500',
            });
        }
    };

    return (
        <div className="flex justify-start items-start w-full lg:p-10 font-work">
            <form
                className="flex justify-start items-start w-full flex-col lg:gap-y-8"
                onSubmit={(e) => e.preventDefault()}
            >
                <div className="flex flex-col lg:gap-y-2 w-full">
                    <Label>Dealer ID</Label>
                    <div className="flex items-center gap-2">
                        <Input
                            placeholder="Approved Dealer ID"
                            value={dealerID}
                            onChange={(e) => setDealerID(e.target.value)}
                            className="shadow rounded max-w-[280px] border"
                            disabled={otpSent}
                        />
                        <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            className="shadow rounded"
                            onClick={handlePasteDealerID}
                            disabled={otpSent}
                        >
                            <ClipboardPaste className="w-4 h-4 text-stone-600" />
                        </Button>
                    </div>
                </div>

                <div className="flex justify-start items-start flex-col lg:gap-y-2 w-full">
                    <Label>Mobile</Label>
                    <Input
                        value={mobile}
                        placeholder="Enter Mobile Number"
                        onChange={(e) => {
                            const input = e.target.value;
                            // Allow only numbers and limit to 10 digits
                            if (/^\d{0,10}$/.test(input)) {
                                setMobile(input);
                            }
                        }}
                        className="shadow rounded max-w-[280px] border"
                        disabled={otpSent}
                    />
                </div>

                <div className="flex justify-start items-start flex-col lg:gap-y-2 w-full">
                    <Label>Email</Label>
                    <Input
                        value={email}
                        placeholder="Enter Email Address"
                        onChange={(e) => setEmail(e.target.value)}
                        className="shadow rounded max-w-[280px] border"
                        disabled={otpSent}
                    />
                </div>
                <div className="flex justify-start items-start flex-col lg:gap-y-2 w-full">
                    <Label>First Name</Label>
                    <Input
                        value={firstName}
                        placeholder="Enter First Name"
                        onChange={(e) => setFirstName(e.target.value)}
                        className="shadow rounded max-w-[280px] border"
                        disabled={otpSent}
                    />
                </div>
                <div className="flex justify-start items-start flex-col lg:gap-y-2 w-full">
                    <Label>Last Name</Label>
                    <Input
                        value={lastName}
                        placeholder="Enter Last Name"
                        onChange={(e) => setLastName(e.target.value)}
                        className="shadow rounded max-w-[280px] border"
                        disabled={otpSent}
                    />
                </div>
                <div className="flex justify-start items-start flex-col lg:gap-y-2 w-full">
                    <Label>Usertype</Label>
                    <Input
                        value={usertype}
                        placeholder="Technician"
                        disabled
                        className="shadow rounded max-w-[280px] border"
                    />
                </div>

                {!otpSent ? (
                    <Button className="px-6 py-2 shadow rounded" onClick={handleSendOTP} disabled={loading}>
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send OTP'}
                    </Button>
                ) : (
                    <>
                        <div className="flex justify-start items-start flex-col lg:gap-y-2 w-full">
                            <Label>OTP</Label>
                            <Input
                                placeholder="6 Digit OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="shadow rounded max-w-[280px] border"
                            />
                        </div>
                        <div className="flex justify-start items-center lg:gap-x-10 w-full">
                            <Button
                                className="px-6 py-2 shadow rounded"
                                onClick={handleRegistration}
                                disabled={loading}
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit'}
                            </Button>
                            <h6
                                className="text-sm underline text-orange-500 underline-offset-4 cursor-pointer"
                                onClick={handleResendOTP}
                            >
                                Resend OTP
                            </h6>
                        </div>
                    </>
                )}
            </form>
        </div>
    );
};

export default AddTechnician;
