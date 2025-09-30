import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../_components/Navbar';
import Sidebar from '../_components/Sidebar';
import { SignedIn, SignedOut, SignIn } from '@clerk/clerk-react';
import { Dialog, DialogContent, DialogTrigger } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Bot } from 'lucide-react';

const MainLayout = () => {
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
                            sidebarOpen ? 'lg:w-48' : 'lg:w-16'
                        }`}
                    >
                        <Sidebar isOpen={sidebarOpen} />
                    </div>

                    {/* Scrollable Main Content */}
                    <main className="flex-1 overflow-y-auto p-4">
                        <Outlet />
                        <div className="absolute right-8 bottom-4">
                            <Dialog>
                                <DialogTrigger>
                                    <Button style={{ borderRadius: '100%' }} className="p-2 w-12 h-12">
                                        <Bot className="w-10 h-10" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent
                                    style={{ borderRadius: '1rem' }}
                                    className="min-w-[300px] min-h-[400px]"
                                >
                                    <iframe
                                        src="https://www.chatbase.co/chatbot-iframe/PTRlFYjs_q3zqoB5axyGP"
                                        width="100%"
                                        height="400px"
                                    ></iframe>
                                </DialogContent>
                            </Dialog>
                        </div>
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

export default MainLayout;
