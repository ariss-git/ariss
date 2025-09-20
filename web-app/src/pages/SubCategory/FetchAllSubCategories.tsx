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
import { ArrowUpDown, Clipboard, Eye, MoreHorizontal, Trash, Loader2, ChevronDown } from 'lucide-react';

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
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { apiURL } from '../../api/apiURL';
import AddSubcategory from './AddSubCategory';

const filterContent = [
    {
        name: 'Products',
        link: '/products',
    },
    {
        name: 'Categories',
        link: '/categories',
    },
];

export type Subcategory = {
    subcategory_id: string;
    subcategory_name: string;
    subcategory_image: string;
    category: {
        category_name: string;
    };
};

const fetchAllSubcategories = async () => {
    const response = await axios.get(`${apiURL}/products/category/sub/all`);
    return response.data.data;
};

export default function FetchAllSubcategories() {
    const [data, setData] = useState<Subcategory[]>([]);
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
            const subcategories = await fetchAllSubcategories();
            setData(subcategories);
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                description: 'Failed to load subcategories',
                className: 'rounded font-work border shadow',
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
            await axios.delete(`${apiURL}/products/category/sub/${modalData.id}`);
            toast({
                description: `${modalData.name} deleted successfully`,
                className: 'rounded font-work',
            });
            setData((prev) => prev.filter((sub) => sub.subcategory_id !== modalData.id));
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                description: `Error deleting ${modalData.name}...`,
                className: 'rounded font-work',
            });
        } finally {
            setLoadingId(null);
            setModalData(null);
            setConfirmInput('');
            setModalOpen(false);
        }
    };

    const columns: ColumnDef<Subcategory>[] = [
        {
            id: 'select',
            header: ({ table }) => (
                <input
                    type="checkbox"
                    checked={table.getIsAllPageRowsSelected()}
                    onChange={table.getToggleAllPageRowsSelectedHandler()}
                />
            ),
            cell: ({ row }) => (
                <input
                    type="checkbox"
                    checked={row.getIsSelected()}
                    onChange={row.getToggleSelectedHandler()}
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: 'subcategory_name',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="font-work"
                >
                    Subcategory Name <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => <div className="capitalize font-work">{row.getValue('subcategory_name')}</div>,
        },
        {
            accessorKey: 'subcategory_image',
            header: 'Image',
            cell: ({ row }) => (
                <img
                    src={row.getValue('subcategory_image')}
                    alt="Subcategory"
                    className="h-10 w-10 object-cover rounded"
                />
            ),
        },
        {
            accessorKey: 'category_name',
            header: 'Category',
            cell: ({ row }) => <span className="font-work">{row.original.category.category_name}</span>,
        },
        {
            id: 'actions',
            cell: ({ row }) => {
                const sub = row.original;
                const isLoading = loadingId === sub.subcategory_id;
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
                                    navigator.clipboard.writeText(sub.subcategory_id);
                                    toast({
                                        description: 'Subcategory ID copied to clipboard',
                                        className: 'rounded font-work',
                                    });
                                }}
                                className="flex justify-between cursor-pointer"
                            >
                                Copy ID <Clipboard />
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex justify-between cursor-pointer">
                                <Link to={`/subcategories/${sub.subcategory_id}`}>View & Edit</Link>
                                <Eye />
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="text-red-500 flex justify-between cursor-pointer"
                                onClick={() => {
                                    setModalData({ name: sub.subcategory_name, id: sub.subcategory_id });
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
                <div className="flex justify-start items-center flex-col gap-y-4">
                    <Input
                        placeholder="Search all subcategories..."
                        onChange={(e) => table.getColumn('subcategory_name')?.setFilterValue(e.target.value)}
                        className="rounded font-work w-[300px]"
                    />
                    {/* <div className="flex justify-start items-center gap-x-6 w-full">
                        <Button
                            onClick={() => navigate('/categories')}
                            size="sm"
                            className="rounded"
                            variant="outline"
                        >
                            Categories
                        </Button>
                        <Button
                            onClick={() => navigate('/products')}
                            size="sm"
                            className="rounded"
                            variant="outline"
                        >
                            Products
                        </Button>
                    </div> */}
                </div>

                <div className="lg:flex hidden justify-center items-center lg:gap-x-6">
                    <AddSubcategory onSuccess={load} />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="default" className="rounded flex items-center gap-2">
                                Filter By <ChevronDown size={16} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="w-[200px] rounded font-work flex flex-col justify-start items-start"
                        >
                            {filterContent.map((content, idx) => (
                                <Button variant="link" onClick={() => navigate(content.link)} key={idx}>
                                    {content.name}
                                </Button>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto rounded font-work">
                                Sort By
                                <ChevronDown className="mr-2 h-4 w-4" />
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
                                        {column.id === 'category.category_name'
                                            ? 'Category'
                                            : column.id.replace('_', ' ')}
                                    </DropdownMenuCheckboxItem>
                                ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="rounded border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
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
                                    className="odd:bg-gray-100 even:bg-white dark:even:bg-stone-500/20 dark:odd:bg-stone-800"
                                    key={row.id}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
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
                                            <span className="text-center">No Subcategories Found</span>
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
                        <DialogTitle>Delete Subcategory</DialogTitle>
                        <DialogDescription>
                            To confirm deletion, type <strong>confirm</strong> and press Delete.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 py-4">
                        <Label>Deleting this will remove associated products.</Label>
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
                            {loadingId === modalData?.id ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : null}
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
