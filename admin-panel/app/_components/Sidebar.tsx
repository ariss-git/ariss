import Link from 'next/link';

const sidebarData = [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Customers', link: '/users' },
    { title: 'Products', link: '/products' },
    { title: 'Categories', link: '/categories' },
    { title: 'Subcategories', link: '/subcategories' },
    { title: 'Products', link: '/products' },
    { title: 'Discounts', link: '/discounts' },
    { title: 'RMA', link: '/rma' },
    { title: 'Orders', link: '/orders' },
    { title: 'Invoices', link: '/invoices' },
    { title: 'Course', link: '/course' },
];

export default function Sidebar() {
    return (
        <aside className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white p-4">
            <h2 className="text-xl font-bold mb-6">ARISS ERP</h2>
            <nav className="space-y-2">
                {sidebarData.map((data, idx) => (
                    <Link key={idx} href={data.link} className="block hover:bg-gray-700 p-2 rounded">
                        {data.title}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}
