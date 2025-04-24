import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getAdminProfile } from '../api/authURL';

type AdminData = {
    admin_id: string;
    fullname: string;
    email: string;
    phone: string;
    password: string;
    usertype: string;
    createdAt: string;
};

interface AdminAuthState {
    isAdmin: boolean;
    admin: AdminData | null;
    fetchAdmin: () => Promise<void>;
    logoutAdmin: () => void;
}

export const useAdminAuthStore = create<AdminAuthState>()(
    persist(
        (set) => ({
            isAdmin: false,
            admin: null,

            fetchAdmin: async () => {
                try {
                    const res = await getAdminProfile();
                    set({ isAdmin: true, admin: res.data.admin });
                } catch {
                    set({ isAdmin: false, admin: null });
                }
            },

            logoutAdmin: () => {
                set({ isAdmin: false, admin: null });
            },
        }),
        {
            name: 'admin-auth', // localStorage key
        }
    )
);
