import { useEffect, useState } from 'react';
import {
    approveDealer,
    assignToDistributor,
    deleteDealer,
    getAllNotApprovedDealers,
} from '../../../api/customerAPI';
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
} from '../../../components/ui/dropdown-menu';
import { Button } from '../../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Input } from '../../../components/ui/input';
import { Checkbox } from '../../../components/ui/checkbox';
import { Badge } from '../../../components/ui/badge';
import {
    ChevronDown,
    Eye,
    Trash,
    MoreHorizontal,
    ShieldPlus,
    Loader2,
    UserRoundCheck,
    PlusCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '../../../hooks/use-toast';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../../../components/ui/dialog';

interface Address {
    adr: string;
    dst: string;
    loc: string;
    pncd: string;
    stcd: string;
}

interface NotApprovedDealer {
    dealer_id: string;
    phone: string;
    email: string;
    gstin: string;
    business_name: string;
    first_name: string;
    last_name: string;
    shipping_address: Address;
    billing_address: Address;
    profile_pic: string;
    isApproved: boolean;
    usertype: 'DEALER';
    isDistributor: boolean;
    createdAt: string;
}

const FetchAllNotApprovedDealers = () => {
    const [data, setData] = useState<NotApprovedDealer[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [globalFilter, setGlobalFilter] = useState('');
    const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
        createdAt: false,
        first_name: false,
        last_name: false,
    });

    const [modalOpen, setModalOpen] = useState(false);
    const [confirmText, setConfirmText] = useState('');
    const [pendingDealer, setPendingDealer] = useState<{ id: string; name: string } | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getAllNotApprovedDealers();
            setData(res.data.data);
        } catch (error) {
            console.error(error);
            toast({
                title: 'Failed to fetch dealers',
                variant: 'destructive',
                description: 'Something went wrong while fetching not approved dealers.',
                className: 'font-work rounded shadow border',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const openConfirmModal = (id: string, name: string) => {
        setConfirmText('');
        setPendingDealer({ id, name });
        setModalOpen(true);
    };

    // Actual delete call after confirmation
    const confirmDelete = async () => {
        if (!pendingDealer) return;
        setLoading(true);
        try {
            await deleteDealer(pendingDealer.id);
            toast({
                title: 'Dealer deleted',
                description: `${pendingDealer.name} has been removed.`,
                className: 'bg-green-500 text-white font-work rounded shadow-md',
            });
            // Refresh list after deletion
            setData((prev) => prev.filter((d) => d.dealer_id !== pendingDealer.id));
            fetchData();
        } catch (err) {
            console.error(err);
            toast({
                title: 'Deletion failed',
                description: 'Could not delete dealer. Check logs or try again.',
                className: 'bg-red-500 text-white font-work rounded shadow-md',
            });
        } finally {
            setModalOpen(false);
            setLoading(false);
        }
    };

    // Approve a dealer
    const handleApproval = async (dealer_id: string, business_name: string) => {
        if (!dealer_id) return;
        setLoading(true);
        try {
            await approveDealer(dealer_id);

            setData((prev) => prev.filter((d) => d.dealer_id !== dealer_id));
            fetchData();
            toast({
                title: `${business_name} approved`,
                description: 'Dealer has been approved successfully.',
                className: 'bg-green-500 text-white font-work rounded shadow-md',
            });
        } catch (error) {
            console.error(error);
            toast({
                title: 'Disapproval failed',
                description: 'Could not disapprove dealer. Check logs or try again.',
                className: 'bg-red-500 text-white font-work rounded shadow-md',
            });
        } finally {
            setLoading(false);
        }
    };

    // Assign this dealer as a distributor
    const handleAssignDistributor = async (dealer_id: string, business_name: string, state: string) => {
        if (!dealer_id) return;
        if (!business_name) return;
        if (!state) return;
        try {
            await assignToDistributor(dealer_id);

            setData((prev) => prev.filter((d) => d.dealer_id !== dealer_id));
            fetchData();

            toast({
                title: `${business_name} is now a Distributor`,
                description: `${business_name} is assigned as distributor in ${state}`,
                className: 'bg-green-500 text-white font-work rounded shadow-md',
            });
        } catch (error) {
            console.error(error);
            toast({
                title: 'Assigning distributor failed',
                description: 'Could not be assigned as distributor. Check logs or try again.',
                className: 'bg-red-500 text-white font-work rounded shadow-md',
            });
        }
    };

    const columns: ColumnDef<NotApprovedDealer>[] = [
        {
            id: 'select',
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected()}
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
        {
            accessorKey: 'email',
            header: 'Email',
        },
        {
            accessorKey: 'phone',
            header: 'Phone',
        },
        {
            accessorKey: 'shipping_address',
            header: 'Shipping Address',
            cell: ({ row }) => {
                const address = row.getValue('shipping_address') as Address;
                return (
                    <div>
                        {`${address.adr}, ${address.loc}, ${address.dst}, ${address.stcd} - ${address.pncd}`}
                    </div>
                );
            },
        },
        {
            accessorKey: 'billing_address',
            header: 'Billing Address',
            id: 'billing_address',
            cell: ({ row }) => {
                const address = row.getValue('billing_address') as Address;
                return (
                    <div>
                        {`${address.adr}, ${address.loc}, ${address.dst}, ${address.stcd} - ${address.pncd}`}
                    </div>
                );
            },
        },
        {
            accessorKey: 'isApproved',
            id: 'isApproved',
            header: 'Approved',
            cell: ({ row }) =>
                row.getValue('isApproved') ? (
                    <Badge className="rounded">Yes</Badge>
                ) : (
                    <Badge className="rounded" variant="outline">
                        No
                    </Badge>
                ),
        },
        {
            accessorKey: 'isDistributor',
            id: 'isDistributor',
            header: 'Distributor',
            cell: ({ row }) =>
                row.getValue('isDistributor') ? (
                    <Badge className="rounded">Yes</Badge>
                ) : (
                    <Badge className="rounded" variant="outline">
                        No
                    </Badge>
                ),
        },
        {
            accessorKey: 'createdAt',
            id: 'createdAt',
            header: 'Date',
            cell: ({ row }) => new Date(row.getValue('createdAt')).toLocaleDateString(),
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const dealer = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded font-work">
                            <DropdownMenuItem asChild>
                                <h6
                                    onClick={() =>
                                        navigate(`/customers/dealers/view-edit/${dealer.dealer_id}`)
                                    }
                                    className="flex items-center justify-between w-full cursor-pointer"
                                >
                                    View & Edit
                                    <Eye className="ml-2 h-4 w-4" />
                                </h6>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleApproval(dealer.dealer_id, dealer.business_name)}
                                className="flex justify-between items-center cursor-pointer"
                            >
                                Approve
                                <ShieldPlus className="ml-2 h-4 w-4" />
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onClick={() =>
                                    handleAssignDistributor(
                                        dealer.dealer_id,
                                        dealer.business_name,
                                        dealer.billing_address.stcd
                                    )
                                }
                                className="flex justify-between items-center cursor-pointer"
                            >
                                Make Distributor
                                <UserRoundCheck className="ml-2 h-4 w-4" />
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="flex justify-between items-center text-red-500 cursor-pointer"
                                onClick={() => openConfirmModal(dealer.dealer_id, dealer.business_name)}
                            >
                                Delete
                                <Trash className="ml-2 h-4 w-4" />
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
            enableSorting: false,
            enableHiding: false,
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
            <div className="flex items-center justify-between">
                <div className="flex justify-start items-start flex-col gap-y-4">
                    <Input
                        placeholder="Search dealers..."
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="w-[250px] rounded"
                    />
                    <div className="flex justify-start items-center gap-x-6">
                        <Button
                            onClick={() => navigate('/customers')}
                            size="sm"
                            className="rounded"
                            variant="outline"
                        >
                            All Customers
                        </Button>
                        <Button
                            onClick={() => navigate('/customers/distributors')}
                            size="sm"
                            className="rounded"
                            variant="outline"
                        >
                            Distributors
                        </Button>
                        <Button
                            onClick={() => navigate('/customers/dealers/approved')}
                            size="sm"
                            className="rounded"
                            variant="outline"
                        >
                            Approved Dealers
                        </Button>
                        <Button
                            onClick={() => navigate('/customers/technicians')}
                            size="sm"
                            className="rounded"
                            variant="outline"
                        >
                            Technicians
                        </Button>
                        <Button
                            onClick={() => navigate('/customers/backoffices')}
                            size="sm"
                            className="rounded"
                            variant="outline"
                        >
                            Back Offices
                        </Button>
                    </div>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className="flex justify-center items-center gap-x-4">
                            <Button
                                variant="default"
                                className="rounded"
                                onClick={() => navigate('/customers/dealers/add')}
                            >
                                Add Customer <PlusCircle className="ml-2 h-4 w-4" />
                            </Button>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="rounded flex items-center gap-2">
                                    Filter <ChevronDown size={16} />
                                </Button>
                            </DropdownMenuTrigger>
                        </div>
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
                                            <span className="text-center">No Disapproved Dealer Found</span>
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
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>

            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent className="rounded font-work">
                    <DialogHeader>
                        <DialogTitle className="text-red-600">Confirm Dealer Deletion</DialogTitle>
                        <p className="lg:text-sm">
                            This action cannot be undone. To delete <strong>{pendingDealer?.name}</strong>,
                            type <code>confirm</code> below:
                        </p>
                    </DialogHeader>
                    <Input
                        placeholder="Type confirm"
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        className="mt-4 rounded"
                    />
                    <DialogFooter>
                        <Button
                            className="rounded shadow-md"
                            variant="outline"
                            onClick={() => setModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="rounded shadow-md"
                            variant="destructive"
                            disabled={confirmText !== 'confirm' || loading}
                            onClick={confirmDelete}
                        >
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default FetchAllNotApprovedDealers;
