import { useEffect, useState } from 'react';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table';
import { ChevronDown, MoreHorizontal, Eye, Check, CheckCheck, X, Trash, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuCheckboxItem,
} from '../../components/ui/dropdown-menu';
import { Input } from '../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { toast } from '../../hooks/use-toast';
import axios from 'axios';
import { acceptRMA, deleteRMA, rejectRMA, resolvedRMA } from '../../api/rmaAPI';
import { Link } from 'react-router-dom';

const apiURL = `${import.meta.env.VITE_API_URL}/api`;

type RMA = {
    rma_id: string;
    first_name: string;
    last_name: string;
    user_type: string;
    email: string;
    phone: string;
    status: string;
    product_name: string;
    product_serial: string;
    product_issue: string;
    product_images: string[];
    createdAt: string;
};

export default function FetchAllInvoices() {
    const [data, setData] = useState<RMA[]>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
        rma_id: false,
        first_name: false,
        last_name: false,
        phone: false,
    });
    const [loading, setLoading] = useState(false);

    const load = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${apiURL}/rma`);
            setData(res.data.data);
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                description: 'Failed to load RMA requests',
                className: 'rounded font-work',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const accepted = async (rma_id: string) => {
        try {
            await acceptRMA(rma_id);

            toast({
                title: `RMA Request Accepted`,
                description: `You have successfully accepted this RMA request.`,
                className: 'bg-green-500 text-white font-work rounded shadow-md',
            });

            load();
        } catch (error) {
            console.error(error);

            toast({
                title: `RMA Request Acceptance Failure`,
                description: `Check logs and try again later.`,
                className: 'bg-red-500 text-white font-work rounded shadow-md',
            });
        }
    };

    const rejected = async (rma_id: string) => {
        try {
            await rejectRMA(rma_id);

            toast({
                title: `RMA Request Rejected`,
                description: `You have successfully rejected this RMA request.`,
                className: 'bg-green-500 text-white font-work rounded shadow-md',
            });

            load();
        } catch (error) {
            console.error(error);
            toast({
                title: `RMA Request Rejection Failure`,
                description: `Check logs and try again later.`,
                className: 'bg-red-500 text-white font-work rounded shadow-md',
            });
        }
    };

    const resolved = async (rma_id: string) => {
        try {
            await resolvedRMA(rma_id);

            toast({
                title: `RMA Request Resolved`,
                description: `You have successfully resolved this RMA request.`,
                className: 'bg-green-500 text-white font-work rounded shadow-md',
            });
            load();
        } catch (error) {
            console.error(error);
            toast({
                title: `RMA Request Resolution Failure`,
                description: `Check logs and try again later.`,
                className: 'bg-red-500 text-white font-work rounded shadow-md',
            });
        }
    };

    const handleDelete = async (rma_id: string) => {
        try {
            await deleteRMA(rma_id);

            toast({
                title: `RMA Deleted`,
                description: `You have successfully deleted this RMA request.`,
                className: 'bg-green-500 text-white font-work rounded shadow-md',
            });
            load();
        } catch (error) {
            console.error(error);
            toast({
                title: `RMA deletion Failure`,
                description: `Check logs and try again later.`,
                className: 'bg-red-500 text-white font-work rounded shadow-md',
            });
        }
    };

    const columns: ColumnDef<RMA>[] = [
        {
            accessorKey: 'rma_id',
            header: 'RMA ID',
            cell: ({ row }) => <div className="truncate max-w-[180px]">{row.getValue('rma_id')}</div>,
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
            header: 'Order ID',
            accessorKey: 'name', // this can be anything, not used here directly
            cell: ({ row }) => {
                const first = row.getValue('first_name');
                const last = row.getValue('last_name');
                return `${first} ${last}`;
            },
        },
        {
            accessorKey: 'product_name',
            header: 'GST',
        },
        {
            accessorKey: 'business_name',
            header: 'Amount',
        },
        {
            accessorKey: 'user_type',
            header: 'Pucharse Type',
            cell: ({ row }) => <div className="uppercase">{row.getValue('user_type')}</div>,
        },
        {
            accessorKey: 'createdAt',
            header: 'Order Date',
            cell: ({ row }) => <div>{new Date(row.getValue('createdAt')).toLocaleDateString()}</div>,
        },
        {
            header: 'Actions',
            id: 'actions',
            cell: ({ row }) => {
                const rma = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded font-work">
                            <DropdownMenuItem className="flex justify-between cursor-pointer">
                                <Link to={`/rma/${rma.rma_id}`}>View</Link> <Eye className="ml-2 h-4 w-4" />
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => accepted(rma.rma_id)}
                                className="flex justify-between cursor-pointer"
                            >
                                Accept RMA <Check className="ml-2 h-4 w-4" />
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => resolved(rma.rma_id)}
                                className="flex justify-between cursor-pointer"
                            >
                                Resolve RMA <CheckCheck className="ml-2 h-4 w-4" />
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => rejected(rma.rma_id)}
                                className="flex justify-between cursor-pointer"
                            >
                                Reject RMA <X className="ml-2 h-4 w-4" />
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleDelete(rma.rma_id)}
                                className="flex justify-between cursor-pointer text-red-500"
                            >
                                Delete <Trash className="ml-2 h-4 w-4" />
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            columnVisibility,
        },
    });

    return (
        <div className="w-full font-work space-y-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
                <Input
                    placeholder="Search all orders..."
                    onChange={(e) => table.getColumn('business_name')?.setFilterValue(e.target.value)}
                    className="w-[300px] rounded"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="rounded">
                            Filter <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded font-work">
                        {table
                            .getAllColumns()
                            .filter((col) => col.getCanHide())
                            .map((column) => (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                    className="capitalize"
                                >
                                    {column.id.replace('_', ' ')}
                                </DropdownMenuCheckboxItem>
                            ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="overflow-x-auto rounded border">
                <Table className="min-w-[1200px]">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="p-4">
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className="whitespace-nowrap text-sm font-semibold p-4"
                                    >
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
                                    className="p-4 odd:bg-gray-100 even:bg-white dark:even:bg-stone-500/20 dark:odd:bg-stone-800 transition-colors"
                                    key={row.id}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="whitespace-nowrap text-sm p-4">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length}>
                                    <div className="h-24 flex items-center justify-center">
                                        {loading ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <span className="text-center">No Invoices Found</span>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-end space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    className="rounded"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="rounded"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
