import { useAdminAuthStore } from '../store/useAdminAuthStore';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { adminLogout, getAdminProfile } from '../api/authURL';
import { toast } from '../hooks/use-toast';
import { useEffect, useState } from 'react';

interface AdminPfp {
    fullname: string;
    profile_pic: string;
}

export default function AdminAccount() {
    const logoutAdmin = useAdminAuthStore((state) => state.logoutAdmin);
    const [adminData, setAdminData] = useState<AdminPfp | null>(null);
    const navigate = useNavigate();

    const getProfile = async () => {
        try {
            const response = await getAdminProfile();
            console.log(response.data);
            setAdminData(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getProfile();
    }, []);

    const handleLogout = async () => {
        try {
            await adminLogout(); // this will hit your backend and clear the
            toast({
                title: 'Logout Successful',
                description: 'See you later Mujahid Patel',
                className: 'font-work shadow bg-green-500 rounded text-stone-100',
            });
        } catch (err) {
            console.error('Logout API failed:', err);
        } finally {
            logoutAdmin(); // clears the state from zustand
            navigate('/admin/login'); // redirect to login page
        }
    };
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer border border-stone-600 shadow p-1">
                    <AvatarImage src="/Ariss_Black_Logo.png" alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 font-work rounded-xl">
                <DropdownMenuLabel>{adminData?.fullname}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem className="cursor-pointer">
                        Profile
                        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                        Settings
                        <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem className="cursor-pointer">Team</DropdownMenuItem>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <DropdownMenuItem className="cursor-pointer">Email</DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">Whatsapp</DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuItem className="cursor-pointer">
                        New Team
                        <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">GitHub</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">Support</DropdownMenuItem>
                <DropdownMenuItem disabled>API</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500">
                    Log out
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
