import { useEffect, useState } from 'react';
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import {
    ArrowUpDown,
    ChevronDown,
    Clipboard,
    Eye,
    MoreHorizontal,
    Trash,
    Loader2,
    PlusCircle,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Checkbox } from '../../components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
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
import axios from 'axios';
import { deleteCategory } from '../../api/categoryAPI';
import { toast } from '../../hooks/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import { apiURL } from '../../api/apiURL';

const filterContent = [
    {
        name: 'Products',
        link: '/products',
    },
    {
        name: 'Subcategories',
        link: '/subcategories',
    },
];

export type Category = {
    category_id: string;
    category_name: string;
    category_image: string;
    createdAt: string;
};

const fetchAllCategories = async () => {
    const response = await axios.get(`${apiURL}/products/category`);
    return response.data.data;
};

export default function FetchAllCategories() {
    const [data, setData] = useState<Category[]>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalData, setModalData] = useState<{ name: string; id: string } | null>(null);
    const [confirmInput, setConfirmInput] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchData = async () => {
        setLoading(true);
        try {
            const categories = await fetchAllCategories();
            setData(categories);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            toast({
                title: 'Failed to fetch categories',
                description: 'There was an error fetching categories. Check logs or try again later...',
                variant: 'destructive',
                className: 'font-work border rounded shadow',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async () => {
        if (!modalData) return;
        setLoadingId(modalData.id);
        try {
            await deleteCategory(modalData.id);
            toast({
                title: `Category deleted`,
                description: `${modalData.name} has been successfully deleted...`,
                variant: 'destructive',
                className: 'rounded font-work border shadow',
            });
            setData((prev) => prev.filter((cat) => cat.category_id !== modalData.id));
            fetchData();
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

    const columns: ColumnDef<Category>[] = [
        {
            id: 'select',
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && 'indeterminate')
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: 'category_name',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="font-work"
                >
                    Category Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => <div className="capitalize font-work">{row.getValue('category_name')}</div>,
        },
        {
            accessorKey: 'category_image',
            header: 'Image',
            cell: ({ row }) => (
                <img
                    src={row.getValue('category_image')}
                    alt="Category"
                    className="h-10 w-10 object-cover rounded"
                />
            ),
        },
        {
            accessorKey: 'createdAt',
            header: () => <div className="text-right font-work">Date</div>,
            cell: ({ row }) => {
                const created = new Date(row.getValue('createdAt')).toLocaleDateString();
                return <div className="text-right font-medium font-work">{created}</div>;
            },
        },
        {
            id: 'actions',
            header: () => <div className="text-left font-work">Actions</div>,
            enableHiding: false,
            cell: ({ row }) => {
                const category = row.original;
                const isLoading = loadingId === category.category_id;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded font-work">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="flex justify-between items-center cursor-pointer"
                                onClick={() => {
                                    navigator.clipboard.writeText(category.category_id);
                                    toast({
                                        description: 'Category ID copied to clipboard',
                                        className: 'rounded shadow-md border font-work',
                                    });
                                }}
                            >
                                Copy ID <Clipboard />
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex justify-between items-center cursor-pointer">
                                <Link to={`/categories/${category.category_id}`}>View & Edit</Link>
                                <Eye />
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="flex justify-between items-center text-red-500 cursor-pointer"
                                onClick={() => {
                                    setModalData({
                                        name: category.category_name,
                                        id: category.category_id,
                                    });
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
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <div className="flex justify-between items-center w-full">
                    <Input
                        placeholder="Search all categories..."
                        value={(table.getColumn('category_name')?.getFilterValue() as string) ?? ''}
                        onChange={(event) =>
                            table.getColumn('category_name')?.setFilterValue(event.target.value)
                        }
                        className="w-[300px] rounded font-work"
                    />
                </div>
                <div className="flex justify-center items-center lg:gap-x-6">
                    <Button variant="default" className="rounded" onClick={() => navigate('/categories/add')}>
                        Add Categories <PlusCircle className="ml-2 h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="default" className="rounded flex items-center gap-2">
                                Filter By <ChevronDown size={16} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px] rounded font-work">
                            {filterContent.map((content, idx) => (
                                <Button variant="link" onClick={() => navigate(content.link)} key={idx}>
                                    {content.name}
                                </Button>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="rounded">
                                Sort By <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="rounded font-work">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => {
                                    const labelMap: Record<string, string> = {
                                        category_name: 'Category Name',
                                        category_image: 'Image',
                                        createdAt: 'Created At',
                                    };

                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize rounded"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                        >
                                            {labelMap[column.id] || column.id}
                                        </DropdownMenuCheckboxItem>
                                    );
                                })}
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
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    className="odd:bg-gray-100 even:bg-white dark:even:bg-stone-500/20 dark:odd:bg-stone-800"
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}
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
                                            <span className="text-center">No Categories Found</span>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground font-work">
                    {table.getFilteredSelectedRowModel().rows.length} of{' '}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
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
            </div>

            {/* MODAL GOES HERE - OUTSIDE OF THE TABLE */}
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent className="rounded font-work">
                    <DialogHeader>
                        <DialogTitle>Delete Category</DialogTitle>
                        <DialogDescription>
                            To confirm deletion, type <strong>confirm</strong> below and press{' '}
                            <strong>Delete</strong>.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 py-4">
                        <Label htmlFor="confirm" className="font-work">
                            Deleting category will delete it's Subcategories and Products as well.
                        </Label>
                        <Input
                            id="confirm"
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
