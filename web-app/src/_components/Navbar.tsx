import { ModeToggle } from '../components/mode-toggle';
import { Bell, PanelLeftClose, PanelRightClose } from 'lucide-react';
import AdminAccount from './AdminAccount';

interface NavbarProps {
    toggleSidebar: () => void;
    isSidebarOpen: boolean;
}

const Navbar = ({ toggleSidebar, isSidebarOpen }: NavbarProps) => {
    return (
        <nav className="w-full h-16 dark:bg-black bg-black text-stone-100 dark:text-stone-100 flex items-center px-4 justify-between fixed top-0 left-0 z-50 border-b dark:border-stone-500 border-black">
            <div className="flex justify-between items-center w-full lg:px-4">
                <div className="flex justify-center items-center lg:gap-x-4">
                    {/* <h1 className="text-4xl font-light text-stone-100 dark:text-stone-100 font-posterama uppercase tracking-tight">
                        Ariss
                    </h1> */}
                    {/* <img className="lg:max-w-32" src="/Ariss_Logo.png" alt="Logo" /> */}
                </div>

                <div className="flex justify-center items-center lg:gap-x-2">
                    <button className="lg:block hidden" onClick={toggleSidebar}>
                        {isSidebarOpen ? (
                            <PanelLeftClose
                                size={16}
                                className="text-stone-100 dark:text-stone-100 stroke-[1.5]"
                            />
                        ) : (
                            <PanelRightClose
                                size={16}
                                className="text-stone-100 dark:text-stone-100 stroke-[1.5]"
                            />
                        )}
                    </button>
                    <ModeToggle />
                    <Bell size={16} className="text-stone-100 dark:text-stone-100 stroke-[1.5] lg:mr-6" />
                    <AdminAccount />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
