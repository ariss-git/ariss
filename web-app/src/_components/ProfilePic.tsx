import { Loader2, Pencil } from 'lucide-react';
import { getAllApprovedDealers, updatePfp } from '../api/customerAPI';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { toast } from '../hooks/use-toast';

interface ProfilePicDealer {
    dealer_id: string;
    business_name: string;
    profile_pic: string;
}

// 🔥 Hardcoded Cloudinary values
const CLOUDINARY_CLOUD_NAME = 'do8p8ql9g';
const CLOUDINARY_UPLOAD_PRESET = 'ariss_uploads';

const ProfilePic = () => {
    const { dealer_id } = useParams();
    const [dealer, setDealer] = useState<ProfilePicDealer | null>(null);
    const [loading, setLoading] = useState(false);
    const [newProfilePic, setNewProfilePic] = useState<string>('');
    const [uploading, setUploading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const loadDealerData = async (dealer_id: string) => {
        if (!dealer_id) return;
        setLoading(true);
        try {
            const response = await getAllApprovedDealers();
            const matchedDealer = response.data.data.find((d: ProfilePicDealer) => d.dealer_id === dealer_id);
            setDealer(matchedDealer || null);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        setUploading(true);
        try {
            const cloudinaryRes = await axios.post(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
                formData
            );
            const uploadedUrl = cloudinaryRes.data.secure_url;
            setNewProfilePic(uploadedUrl);
        } catch (error) {
            console.error('Cloudinary upload failed:', error);
            alert('Upload to Cloudinary failed. Check console.');
        } finally {
            setUploading(false);
        }
    };

    const handleUpdate = async () => {
        if (!dealer_id || !newProfilePic) return;
        try {
            await updatePfp(dealer_id, newProfilePic);
            await loadDealerData(dealer_id); // Refresh dealer data
            setNewProfilePic('');
            toast({
                title: 'Profile picture changed',
                description: 'Business logo has been changed successfully',
                className: 'font-work rounded shadow border bg-green-500',
            });
        } catch (error) {
            console.error('Failed to update profile picture:', error);
            alert('Update failed. Check console.');
        }
    };

    useEffect(() => {
        loadDealerData(dealer_id!);
    }, [dealer_id]);

    if (loading || !dealer) {
        return (
            <div className="flex justify-center items-center w-full min-h-screen">
                <Loader2 className="w-20 h-20 dark:text-stone-500 text-stone-800 stroke-[1] animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-y-4 p-6 lg:p-10 font-work bg-animated">
            <h1 className="text-3xl lg:text-4xl font-semibold">{dealer.business_name}</h1>

            <p className="text-sm text-stone-800">Change Business Logo by clicking the pen below</p>

            <div className="flex flex-col items-start gap-4">
                <div className="relative profile-img-container">
                    <img
                        src={newProfilePic || dealer.profile_pic}
                        alt="Profile"
                        className="w-60 h-60 object-cover rounded-full border border-black"
                    />
                    <Pencil
                        className="absolute bottom-2 right-2 w-6 h-6 p-1 bg-transparent cursor-pointer hover:text-blue-500 transition"
                        onClick={() => inputRef.current?.click()}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        ref={inputRef}
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </div>

                {uploading && <p className="text-sm text-gray-600">Uploading to Cloudinary...</p>}

                {newProfilePic && (
                    <Button
                        className="rounded shadow button-hover-effect"
                        onClick={handleUpdate}
                        disabled={uploading}
                    >
                        Save Changes
                    </Button>
                )}
            </div>
        </div>
    );
};

export default ProfilePic;
