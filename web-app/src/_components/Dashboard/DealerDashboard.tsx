import { useEffect, useState } from 'react';
import { getAllApprovedDealers } from '../../api/customerAPI';
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    ColumnDef,
    flexRender,
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Checkbox } from '../../components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import { toast } from '../../hooks/use-toast';

interface ApprovedDealer {
    dealer_id: string;
    gstin: string;
    business_name: string;
    first_name: string;
    last_name: string;
    profile_pic: string;
    usertype: 'DEALER';
}

const FetchDealersOnDashboard = () => {
    const [data, setData] = useState<ApprovedDealer[]>([]);
    const [loading, setLoading] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
        createdAt: false, // FilterSilter default hide
        first_name: false,
        last_name: false,
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getAllApprovedDealers();
            setData(res.data.data);
        } catch (err) {
            console.error(err);
            toast({
                title: 'Failed to fetch dealers',
                variant: 'destructive',
                description: 'Something went wrong while fetching approved dealers.',
                className: 'font-work rounded shadow border',
            });
        } finally {
            setLoading(false);
        }
    };

    // Fetch data on mount
    useEffect(() => {
        fetchData();
    }, []);

    const columns: ColumnDef<ApprovedDealer>[] = [
        {
            id: 'select',
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected()}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: 'first_name',
            header: 'First Name',
            id: 'first_name',
        },
        {
            accessorKey: 'last_name',
            header: 'Last Name',
            id: 'last_name',
        },
        {
            accessorKey: 'profile_pic',
            header: 'Business Logo',
            id: 'profile_pic',
            cell: ({ row }) => {
                const pfp = row.getValue('profile_pic');
                return <img src={pfp as string} alt="Logo" className="object-contain lg:w-10 lg:h-10" />;
            },
        },
        {
            header: 'Name',
            accessorKey: 'name', // this can be anything, not used here directly
            cell: ({ row }) => {
                const first = row.getValue('first_name');
                const last = row.getValue('last_name');
                return `${first} ${last}`;
            },
        },
        {
            accessorKey: 'business_name',
            header: 'Business',
        },
        {
            accessorKey: 'gstin',
            header: 'GSTIN',
        },
    ];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            globalFilter,
            columnVisibility,
        },
        onGlobalFilterChange: setGlobalFilter,
        onColumnVisibilityChange: setColumnVisibility,
    });

    return (
        <div className="space-y-4 p-6 font-work rounded">
            {/* Scrollable table */}
            <h1 className="text-stone-500 text-xl">Active Dealers</h1>
            <div className="lg:min-w-[635px] lg:max-w-[635px] w-full border rounded shadow">
                <Table className="text-sm w-full">
                    <TableHeader>
                        {table.getHeaderGroups().map((group) => (
                            <TableRow key={group.id}>
                                {group.headers.map((header) => (
                                    <TableHead key={header.id} className="px-4 py-2 whitespace-nowrap">
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    className="odd:bg-gray-100 even:bg-white dark:even:bg-stone-500/20 dark:odd:bg-stone-800"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="px-4 py-2 whitespace-nowrap">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length}>
                                    <div className="flex justify-center items-center w-full h-24">
                                        {loading ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <span className="text-center">No Active Dealers Found</span>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default FetchDealersOnDashboard;
