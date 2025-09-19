import { useEffect, useState } from 'react';
import { getAllProducts, deleteProduct } from '../../api/productAPI';
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    ColumnDef,
    flexRender,
} from '@tanstack/react-table';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { Button } from '../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { ChevronDown, Eye, Trash, MoreHorizontal, Loader2, PlusCircle } from 'lucide-react';
import { Dialog, DialogContent } from '../../components/ui/dialog';
import { toast } from '../../hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const filterContent = [
    {
        name: 'Categories',
        link: '/categories',
    },
    {
        name: 'Subcategories',
        link: '/subcategories',
    },
];

interface Product {
    product_id: string;
    product_title: string;
    product_description: string;
    product_type: string;
    product_label: string;
    product_visibility: string;
    product_usps: string;
    product_sku: string;
    product_image: string[];
    product_keywords: string[];
    product_price: number;
    product_quantity: number;
    createdAt: string;
    category?: { category_name: string };
    subcategory?: { subcategory_name: string };
}

const FetchAllProducts = () => {
    const [data, setData] = useState<Product[]>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
        createdAt: false,
        product_keywords: false,
        product_sku: false,
        product_usps: false,
    });

    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getAllProducts();
            setData(res.data.data);
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                title: 'Failed to fetch products',
                description: 'Check logs or try again later...',
                className: 'font-work border shadow rounded',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async () => {
        if (selectedProductId && deleteConfirm === 'confirm') {
            await deleteProduct(selectedProductId);
            toast({ title: 'Product deleted successfully', className: 'rounded shadow-md font-work' });
            setData((prev) => prev.filter((p) => p.product_id !== selectedProductId));
            fetchData();
            setSelectedProductId(null);
            setDeleteConfirm('');
            setDeleteDialogOpen(false);
        } else {
            toast({ variant: 'destructive', title: 'Type "confirm" to delete the product' });
        }
    };

    const columns: ColumnDef<Product>[] = [
        { accessorKey: 'product_title', header: 'Name' },
        {
            accessorKey: 'category',
            header: 'Category',
            cell: ({ row }) => row.original.category?.category_name || '-',
        },
        {
            accessorKey: 'subcategory',
            header: 'Subcategory',
            cell: ({ row }) => row.original.subcategory?.subcategory_name || '-',
        },
        {
            accessorKey: 'product_image',
            header: 'Image',
            cell: ({ row }) => (
                <img
                    className="lg:min-w-[80px] lg:max-w-[80px] lg:min-h-[80px] lg:max-h-[80px] object-cover"
                    src={row.original.product_image[0]}
                    alt="Product"
                />
            ),
        },
        {
            accessorKey: 'product_price',
            header: 'Price',
            cell: ({ row }) => `₹ ${row.original.product_price}`,
        },
        { accessorKey: 'product_quantity', header: 'Stock' },
        {
            accessorKey: 'product_keywords',
            header: 'Keywords',
            cell: ({ row }) =>
                row.original.product_keywords?.length ? (
                    <div className="flex flex-wrap gap-1 max-w-[300px]">
                        {row.original.product_keywords.map((kw, i) => (
                            <Badge key={i} variant="outline" className="px-2 py-0.5 text-xs rounded">
                                {kw}
                            </Badge>
                        ))}
                    </div>
                ) : (
                    '-'
                ),
        },
        { accessorKey: 'product_type', header: 'Type' },
        { accessorKey: 'product_label', header: 'Label' },
        { accessorKey: 'product_sku', header: 'SKU' },
        { accessorKey: 'product_usps', header: 'USP' },
        {
            accessorKey: 'createdAt',
            header: 'Date',
            cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
        },
        {
            id: 'actions',
            header: 'Actions',
            enableSorting: false,
            enableHiding: false,
            cell: ({ row }) => {
                const product = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded font-work">
                            <DropdownMenuItem
                                onClick={() => navigate(`/products/${product.product_id}`)}
                                className="flex justify-between items-center cursor-pointer"
                            >
                                <h6>View & Edit</h6>
                                <Eye className="ml-2 h-4 w-4" />
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    setSelectedProductId(product.product_id);
                                    setDeleteDialogOpen(true);
                                }}
                                className="flex justify-between items-center cursor-pointer text-red-500"
                            >
                                Delete
                                <Trash className="ml-2 h-4 w-4 text-red-500" />
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
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: { globalFilter, columnVisibility },
        onGlobalFilterChange: setGlobalFilter,
        onColumnVisibilityChange: setColumnVisibility,
    });

    return (
        <div className="space-y-4 p-6 font-work rounded">
            <div className="flex items-center justify-between">
                <div className="flex justify-start items-center flex-col gap-y-4">
                    <Input
                        placeholder="Search all products..."
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="w-[300px] rounded"
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
                            onClick={() => navigate('/subcategories')}
                            size="sm"
                            className="rounded"
                            variant="outline"
                        >
                            Subcategories
                        </Button>
                    </div> */}
                </div>
                <div className="lg:flex hidden justify-center items-center lg:gap-x-6">
                    <Button variant="default" className="rounded" onClick={() => navigate('/products/add')}>
                        Add Products <PlusCircle className="ml-2 h-4 w-4" />
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
                            <Button variant="outline" className="ml-auto rounded font-work">
                                Sort By
                                <ChevronDown className="mr-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-[200px] rounded font-work">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                    >
                                        {typeof column.columnDef.header === 'string'
                                            ? column.columnDef.header
                                            : column.id.replace(/_/g, ' ')}
                                    </DropdownMenuCheckboxItem>
                                ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="overflow-auto rounded border">
                <Table className="min-w-[1000px] text-sm">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className="px-4 py-2 text-left whitespace-nowrap"
                                        style={{ minWidth: '120px' }}
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
                                    className="odd:bg-gray-100 even:bg-white dark:even:bg-stone-500/20 dark:odd:bg-stone-800"
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}
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
                                            <span className="text-center">No Products Found</span>
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
                    className="rounded shadow-md"
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    className="rounded shadow-md"
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="space-y-4 rounded shadow-md font-work">
                    <h2 className="text-lg font-semibold">Product Delete:</h2>
                    <p>
                        Type <span className="font-semibold">confirm</span> to delete this product
                        permanently.
                    </p>
                    <Input
                        placeholder="confirm"
                        value={deleteConfirm}
                        onChange={(e) => setDeleteConfirm(e.target.value)}
                    />
                    <div className="flex justify-end gap-2">
                        <Button
                            className="rounded shadow-md"
                            variant="outline"
                            onClick={() => {
                                setSelectedProductId(null);
                                setDeleteConfirm('');
                                setDeleteDialogOpen(false);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="rounded shadow-md"
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleteConfirm !== 'confirm'}
                        >
                            Delete
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default FetchAllProducts;
