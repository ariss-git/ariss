import FetchAllCustomers from './FetchAllCustomers';

const Customer = () => {
    return (
        <div className="flex flex-col lg:gap-y-6 justify-start w-full h-full lg:p-12 bg-transparent lg:px-4 lg:py-8">
            <h1 className="font-work text-left text-6xl font-semibold capitalize dark:text-stone-100 text-stone-800">
                All Customers:
            </h1>
            <FetchAllCustomers />
        </div>
    );
};

export default Customer;
