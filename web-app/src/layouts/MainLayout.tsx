import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../_components/Navbar';
import Sidebar from '../_components/Sidebar';
import { SignedIn, SignedOut, SignIn } from '@clerk/clerk-react';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const toggleSidebar = () => setSidebarOpen((prev) => !prev);

    return (
        <div className="flex flex-col h-screen">
            <SignedIn>
                {/* Sticky Navbar */}
                <div className="fixed top-0 left-0 right-0 z-50">
                    <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />
                </div>

                {/* Below Navbar */}
                <div className="flex flex-1 pt-16 overflow-hidden">
                    {/* Sidebar */}
                    <div
                        className={`transition-all duration-300 ease-in-out h-full ${
                            sidebarOpen ? 'w-48' : 'w-16'
                        }`}
                    >
                        <Sidebar isOpen={sidebarOpen} />
                    </div>

                    {/* Scrollable Main Content */}
                    <main className="flex-1 overflow-y-auto p-4">
                        <Outlet />
                    </main>
                </div>
            </SignedIn>
            <SignedOut>
                <SignIn
                    appearance={{
                        elements: { footerAction: 'none' },
                    }}
                />
            </SignedOut>
        </div>
    );
};

export default AdminLayout;
