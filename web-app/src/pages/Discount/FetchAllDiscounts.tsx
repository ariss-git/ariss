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
import { Clipboard, Trash, Loader2, ChevronDown, MoreHorizontal, PlusCircleIcon } from 'lucide-react';

import { Button } from '../../components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuCheckboxItem,
} from '../../components/ui/dropdown-menu';
import { Input } from '../../components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { toast } from '../../hooks/use-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const apiURL = 'http://localhost:5000/api';

type Discount = {
    discount_id: string;
    business_name: string;
    discount_type: string;
    expiry_date: string;
    assignedAt: string;
    amount: number | null;
    percentage: number | null;
    coupon_code: string;
};

export default function FetchAllDiscounts() {
    const [data, setData] = useState<Discount[]>([]);
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalData, setModalData] = useState<{ name: string; id: string } | null>(null);
    const [confirmInput, setConfirmInput] = useState('');
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const load = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${apiURL}/discount`);
            setData(res.data.data);
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                description: 'Failed to load discounts',
                className: 'rounded font-work',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const handleDelete = async () => {
        if (!modalData) return;
        setLoadingId(modalData.id);
        try {
            await axios.delete(`${apiURL}/discount/${modalData.id}`);
            toast({
                description: `Discount ${modalData.name} deleted successfully`,
                variant: 'destructive',
                className: 'rounded font-work border shadow-sm',
            });
            setData((prev) => prev.filter((d) => d.discount_id !== modalData.id));
            load();
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                description: `Error deleting discount...`,
                className: 'rounded font-work',
            });
        } finally {
            setLoadingId(null);
            setModalData(null);
            setConfirmInput('');
            setModalOpen(false);
        }
    };

    const columns: ColumnDef<Discount>[] = [
        {
            accessorKey: 'coupon_code',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="font-work"
                >
                    Coupon Code
                </Button>
            ),
            cell: ({ row }) => <div className="font-work">{row.getValue('coupon_code')}</div>,
        },
        {
            accessorKey: 'discount_type',
            header: 'Type',
            cell: ({ row }) => <div className="capitalize font-work">{row.getValue('discount_type')}</div>,
        },
        {
            accessorKey: 'business_name',
            header: 'Business',
            cell: ({ row }) => <div className="capitalize font-work">{row.getValue('business_name')}</div>,
        },
        {
            accessorKey: 'product_title',
            header: 'Product',
            cell: ({ row }) => <div className="capitalize font-work">{row.getValue('product_title')}</div>,
        },
        {
            accessorKey: 'assignedAt',
            header: 'Assigned Date',
            cell: ({ row }) => <div>{new Date(row.getValue('assignedAt')).toLocaleDateString()}</div>,
        },
        {
            accessorKey: 'expiry_date',
            header: 'Expiry Date',
            cell: ({ row }) => <div>{new Date(row.getValue('expiry_date')).toLocaleDateString()}</div>,
        },
        {
            accessorKey: 'amount',
            header: 'Amount',
            cell: ({ row }) => <div>{row.getValue('amount') ?? '-'}</div>,
        },
        {
            accessorKey: 'percentage',
            header: 'Percentage',
            cell: ({ row }) => <div>{row.getValue('percentage') ?? '-'}</div>,
        },
        {
            header: 'Actions',
            id: 'actions',
            cell: ({ row }) => {
                const discount = row.original;
                const isLoading = loadingId === discount.discount_id;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded font-work">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => {
                                    navigator.clipboard.writeText(discount.discount_id);
                                    toast({
                                        description: 'Discount ID copied to clipboard',
                                        className: 'rounded font-work',
                                    });
                                }}
                                className="flex justify-between cursor-pointer"
                            >
                                Copy ID <Clipboard />
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="text-red-500 flex justify-between cursor-pointer"
                                onClick={() => {
                                    setModalData({ name: discount.coupon_code, id: discount.discount_id });
                                    setModalOpen(true);
                                }}
                            >
                                Delete {isLoading ? <Loader2 className="animate-spin" /> : <Trash />}
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
        <div className="w-full">
            <div className="flex items-center justify-between py-4">
                <Input
                    placeholder="Search businesses..."
                    onChange={(e) => table.getColumn('coupon_code')?.setFilterValue(e.target.value)}
                    className="max-w-sm rounded font-work"
                />

                <DropdownMenu>
                    <div className="flex justify-center items-center gap-x-4">
                        <Button onClick={() => navigate('/discounts/add')} className="shadow rounded">
                            Add Discounts <PlusCircleIcon />
                        </Button>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto rounded font-work">
                                Sort By
                                <ChevronDown className="mr-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                    </div>
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

            <div className="rounded border">
                <Table>
                    <TableHeader className="font-work rounded">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow className="font-work rounded" key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead className="font-work rounded" key={header.id}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody className="font-work rounded">
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    className="p-4 odd:bg-gray-100 even:bg-white dark:even:bg-stone-500/20 dark:odd:bg-stone-800 transition-colors font-work rounded"
                                    key={row.id}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell className="font-work rounded" key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow className="font-work rounded">
                                <TableCell colSpan={columns.length}>
                                    <div className="h-24 flex items-center justify-center">
                                        {loading ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <span className="text-center">No Discounts Found</span>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    className="rounded font-work"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="rounded font-work"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>

            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent className="rounded font-work">
                    <DialogHeader>
                        <DialogTitle>Delete Discount</DialogTitle>
                        <DialogDescription>
                            To confirm deletion, type <strong>confirm</strong> and press Delete.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 py-4">
                        <Label>This will permanently delete the discount.</Label>
                        <Input
                            value={confirmInput}
                            onChange={(e) => setConfirmInput(e.target.value)}
                            placeholder="confirm"
                            className="rounded font-work"
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            variant="destructive"
                            disabled={confirmInput !== 'confirm' || loadingId === modalData?.id}
                            onClick={handleDelete}
                            className="rounded font-work"
                        >
                            {loadingId === modalData?.id && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
