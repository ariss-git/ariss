import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import FetchAllOrders from './FetchAllOrders';

const Orders = () => {
    return (
        <div className="flex flex-col lg:gap-y-6 justify-start w-full h-full lg:p-12 bg-transparent lg:px-4 lg:py-8">
            <h1 className="font-work text-left text-[16px] font-semibold capitalize dark:text-stone-100 text-[#495057] flex items-center">
                <Link to="/">
                    <ArrowLeft className="w-4 h-4 mr-2 " />
                </Link>
                All Orders:
            </h1>
            <FetchAllOrders />
        </div>
    );
};

export default Orders;
