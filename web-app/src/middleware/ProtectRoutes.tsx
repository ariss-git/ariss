import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuthStore } from '../store/useAdminAuthStore';

const ProtectRoutes = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();
    const { isAdmin, fetchAdmin } = useAdminAuthStore();

    useEffect(() => {
        const checkAuth = async () => {
            await fetchAdmin();
        };
        checkAuth();
    }, [fetchAdmin]);

    useEffect(() => {
        if (!isAdmin) {
            navigate('/login');
        }
    }, [isAdmin, navigate]);

    return isAdmin ? <>{children}</> : null;
};

export default ProtectRoutes;
