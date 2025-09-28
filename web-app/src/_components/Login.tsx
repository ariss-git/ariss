import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useSignIn } from '@clerk/clerk-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [magicLinkSent, setMagicLinkSent] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { isLoaded, signIn } = useSignIn();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!isLoaded) return;

        setLoading(true);
        setError(null);

        try {
            const result = await signIn.create({
                identifier: email,
                strategy: 'email_link',
                redirectUrl: window.location.origin,
            });

            console.log('Magic link sent result:', result);
            setMagicLinkSent(true);
        } catch (err: any) {
            console.error('Error sending magic link:', err);
            if (err.errors && err.errors.length > 0) {
                setError(err.errors[0].longMessage || 'An unexpected error occurred.');
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center w-full min-h-screen bg-white font-work">
            <div className="h-[360px] w-[50%] p-10 flex justify-start items-start flex-col bg-white lg:ml-16">
                <motion.h4
                    initial={{ opacity: '0', y: -20 }}
                    animate={{ opacity: '1', y: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="lg:text-lg text-black uppercase"
                >
                    Verified Account only
                </motion.h4>
                <motion.h2
                    initial={{ opacity: '0', y: -20 }}
                    animate={{ opacity: '1', y: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="lg:text-3xl font-semibold lg:mt-2 text-black capitalize"
                >
                    Sign in to your account
                </motion.h2>
                <motion.div
                    initial={{ opacity: '0', y: 20 }}
                    animate={{ opacity: '1', y: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="lg:mt-10 text-black flex justify-start items-start flex-col gap-y-2"
                >
                    <Label className="lg:text-xs">Email Address</Label>
                    <form onSubmit={handleSubmit} className="flex items-center lg:gap-x-2">
                        <Input
                            style={{ borderRadius: '0.3rem' }}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="placeholder:text-muted-foreground/70  lg:w-[265px]"
                            placeholder="admin@ariss.io"
                        />
                        <Button type="submit" disabled={loading} style={{ borderRadius: '0.3rem' }}>
                            {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <ArrowRight className="w-4 h-4" />
                            )}
                        </Button>
                    </form>
                    {error && <Label className="lg:text-xs text-red-500">{error}</Label>}
                    {magicLinkSent && (
                        <Label className="lg:text-xs text-green-500">OTP link sent to your email.</Label>
                    )}
                </motion.div>
            </div>
            <div className="h-[560px] mx-4 w-[50%] bg-black rounded-xl flex justify-center items-center">
                <img src="Ariss_Logo.png" alt="Logo" className="w-[70%]" />
            </div>
        </div>
    );
};

export default Login;
