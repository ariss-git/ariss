// src/components/Sidebar.tsx
import clsx from 'clsx';
import {
    ArrowLeftRight,
    BookCheck,
    Landmark,
    LayoutDashboard,
    NotebookPen,
    Package2,
    ShoppingCart,
    TicketPercent,
    Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface SidebarProps {
    isOpen: boolean;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
    return (
        <aside
            className={clsx(
                'dark:bg-black bg-black text-stone-100 dark:text-stone-100 h-full transition-all duration-300 border-r border-stone-500 hidden lg:flex justify-start items-center flex-col lg:gap-y-1 lg:px-1.5 lg:py-2',
                isOpen ? 'w-48' : 'w-12 px-1',
                'overflow-hidden'
            )}
        >
            <button className="bg-transparent text-stone-100 dark:text-stone-100 w-full shadow-none flex justify-between items-center lg:px-1.5 lg:py-2 text-base font-normal hover:bg-gray-500/30 rounded-sm">
                <Link to="/">
                    <span className="flex items-center gap-x-2 text-[15px] text-[#ABB9E8] hover:text-stone-50 transition duration-300 font-work">
                        <LayoutDashboard size={20} className="min-w-[20px] min-h-[20px] stroke-[1.5] mr-2" />
                        Dashboard
                    </span>
                    <span />
                </Link>
            </button>
            <button className="bg-transparent text-stone-100 dark:text-stone-100 w-full shadow-none flex justify-between items-center lg:px-1.5 lg:py-2 text-base font-normal hover:bg-gray-500/30 rounded-sm">
                <Link to="/customers">
                    <span className="flex items-center gap-x-2 text-[15px] text-[#ABB9E8] hover:text-stone-50 transition duration-300 font-work">
                        <Users size={20} className="min-w-[20px] min-h-[20px] stroke-[1.5] mr-2" />
                        Customers
                    </span>
                    <span />
                </Link>
            </button>
            {/* <button className="bg-transparent text-stone-100 dark:text-stone-100 w-full shadow-none flex justify-between items-center lg:px-1.5 lg:py-2 text-base font-normal hover:bg-gray-500/30 rounded-sm">
                <Link to="/categories">
                    <span className="flex items-center gap-x-2 text-[15px] text-[#ABB9E8] hover:text-stone-50 transition duration-300 font-work">
                        <Network size={20} className="min-w-[20px] min-h-[20px] stroke-[1.5] mr-2" />
                        Categories
                    </span>
                    <span />
                </Link>
            </button> */}
            <button className="bg-transparent text-stone-100 dark:text-stone-100 w-full shadow-none flex justify-between items-center lg:px-1.5 lg:py-2 text-base font-normal hover:bg-gray-500/30 rounded-sm">
                <Link to="/products">
                    <span className="flex items-center gap-x-2 text-[15px] text-[#ABB9E8] hover:text-stone-50 transition duration-300 font-work">
                        <Package2 size={20} className="min-w-[20px] min-h-[20px] stroke-[1.5] mr-2" />
                        Products
                    </span>
                    <span />
                </Link>
            </button>
            <button className="bg-transparent text-stone-100 dark:text-stone-100 w-full shadow-none flex justify-between items-center lg:px-1.5 lg:py-2 text-base font-normal hover:bg-gray-500/30 rounded-sm">
                <Link to="/discounts">
                    <span className="flex items-center gap-x-2 text-[15px] text-[#ABB9E8] hover:text-stone-50 transition duration-300 font-work">
                        <TicketPercent size={20} className="min-w-[20px] min-h-[20px] stroke-[1.5] mr-2" />
                        Discounts
                    </span>
                    <span />
                </Link>
            </button>
            <button className="bg-transparent text-stone-100 dark:text-stone-100 w-full shadow-none flex justify-between items-center lg:px-1.5 lg:py-2 text-base font-normal hover:bg-gray-500/30 rounded-sm">
                <Link to="/rma">
                    <span className="flex items-center gap-x-2 text-[15px] text-[#ABB9E8] hover:text-stone-50 transition duration-300 font-work">
                        <ArrowLeftRight size={20} className="min-w-[20px] min-h-[20px] stroke-[1.5] mr-2" />
                        RMA
                    </span>
                    <span />
                </Link>
            </button>
            <button className="bg-transparent text-stone-100 dark:text-stone-100 w-full shadow-none flex justify-between items-center lg:px-1.5 lg:py-2 text-base font-normal hover:bg-gray-500/30 rounded-sm">
                <Link to="/orders">
                    <span className="flex items-center gap-x-2 text-[15px] text-[#ABB9E8] hover:text-stone-50 transition duration-300 font-work">
                        <ShoppingCart size={20} className="min-w-[20px] min-h-[20px] stroke-[1.5] mr-2" />
                        Orders
                    </span>
                    <span />
                </Link>
            </button>
            <button className="bg-transparent text-stone-100 dark:text-stone-100 w-full shadow-none flex justify-between items-center lg:px-1.5 lg:py-2 text-base font-normal hover:bg-gray-500/30 rounded-sm">
                <Link to="/invoices">
                    <span className="flex items-center gap-x-2 text-[15px] text-[#ABB9E8] hover:text-stone-50 transition duration-300 font-work">
                        <Landmark size={20} className="min-w-[20px] min-h-[20px] stroke-[1.5] mr-2" />
                        Invoices
                    </span>
                    <span />
                </Link>
            </button>
            {/* <button className="bg-transparent text-stone-100 dark:text-stone-100 w-full shadow-none flex justify-between items-center lg:px-1.5 lg:py-2 text-base font-normal hover:bg-gray-500/30 rounded-sm">
                <Link to="/wishlists">
                    <span className="flex items-center gap-x-2 text-[15px] text-[#ABB9E8] hover:text-stone-50 transition duration-300 font-work">
                        <Heart size={20} className="min-w-[20px] min-h-[20px] stroke-[1.5] mr-2" />
                        Wishlists
                    </span>
                    <span />
                </Link>
            </button> */}
            <button className="bg-transparent text-stone-100 dark:text-stone-100 w-full shadow-none flex justify-between items-center lg:px-1.5 lg:py-2 text-base font-normal hover:bg-gray-500/30 rounded-sm">
                <Link to="/courses">
                    <span className="flex items-center gap-x-2 text-[15px] text-[#ABB9E8] hover:text-stone-50 transition duration-300 font-work">
                        <BookCheck size={20} className="min-w-[20px] min-h-[20px] stroke-[1.5] mr-2" />
                        Courses
                    </span>
                    <span />
                </Link>
            </button>
            <button className="bg-transparent text-stone-100 dark:text-stone-100 w-full shadow-none flex justify-between items-center lg:px-1.5 lg:py-2 text-base font-normal hover:bg-gray-500/30 rounded-sm">
                <Link to="/tests">
                    <span className="flex items-center gap-x-2 text-[15px] text-[#ABB9E8] hover:text-stone-50 transition duration-300 font-work">
                        <NotebookPen size={20} className="min-w-[20px] min-h-[20px] stroke-[1.5] mr-2" />
                        Questions
                    </span>
                    <span />
                </Link>
            </button>
        </aside>
    );
};

export default Sidebar;
