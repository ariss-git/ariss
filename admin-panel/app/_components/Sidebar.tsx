export default function Sidebar() {
    return (
        <aside className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white p-4">
            <h2 className="text-xl font-bold mb-6">ARISS ERP</h2>
            <nav className="space-y-3">
                <a href="/dashboard" className="block hover:bg-gray-700 p-2 rounded">
                    Dashboard
                </a>
                <a href="/dashboard/settings" className="block hover:bg-gray-700 p-2 rounded">
                    Settings
                </a>
            </nav>
        </aside>
    );
}
