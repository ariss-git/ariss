import { useEffect, useState } from 'react';
import { assignDistributorToDealer, deleteDealer, getAllDistributors } from '../../api/customerAPI';
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
import { Checkbox } from '../../components/ui/checkbox';
import { Badge } from '../../components/ui/badge';
import { ChevronDown, Eye, Trash, MoreHorizontal, Loader2, UserRoundX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '../../hooks/use-toast';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { useOrganization, useUser } from '@clerk/clerk-react';

interface Address {
    adr: string;
    dst: string;
    loc: string;
    pncd: string;
    stcd: string;
}

interface DistributorDealer {
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

const FetchAllDistributors = () => {
    const [data, setData] = useState<DistributorDealer[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [globalFilter, setGlobalFilter] = useState('');
    const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
        createdAt: false,
        billing_address: false,
        first_name: false,
        last_name: false,
    });

    const { user } = useUser();
    const { organization } = useOrganization();

    // Find the user's membership in the current organization
    const userMembership = user?.organizationMemberships.find(
        (membership) => membership.organization.id === organization?.id
    );

    // Get the role key string from the membership
    const userRole = userMembership?.role;

    const [modalOpen, setModalOpen] = useState(false);
    const [confirmText, setConfirmText] = useState('');
    const [pendingDealer, setPendingDealer] = useState<{ id: string; name: string } | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await getAllDistributors();
                setData(res.data.data);
            } catch (error) {
                console.error(error);
                toast({
                    variant: 'destructive',
                    title: 'Error fetching distributors',
                    description: 'There was an error fetching distributors. Please try again later...',
                    className: 'font-work border rounded shadow',
                });
            } finally {
                setLoading(false);
            }
        };

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
                className: 'bg-green-500 text-white font-work',
            });
            // Refresh list after deletion
            setData((prev) => prev.filter((d) => d.dealer_id !== pendingDealer.id));
        } catch (err) {
            console.error(err);
            toast({
                title: 'Deletion failed',
                description: 'Could not delete dealer. Check logs or try again.',
                className: 'bg-red-500 text-white font-work',
            });
        } finally {
            setModalOpen(false);
            setLoading(false);
        }
    };

    // Assign this dealer as a distributor
    const handleAssignDistributorToDealer = async (dealer_id: string, business_name: string) => {
        if (!dealer_id) return;
        if (!business_name) return;
        try {
            await assignDistributorToDealer(dealer_id);

            setData((prev) => prev.filter((d) => d.dealer_id !== dealer_id));

            toast({
                title: `${business_name} is now a normal dealer`,
                description: `${business_name} is assigned back to dealer`,
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

    const columns: ColumnDef<DistributorDealer>[] = [
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
            accessorKey: 'shipping_address',
            header: 'State',
            cell: ({ row }) => {
                const state = row.getValue('shipping_address') as Address;
                return <div className="max-w-[220px]">{`${state.stcd}`}</div>;
            },
        },
        {
            accessorKey: 'shipping_address',
            header: 'City',
            cell: ({ row }) => {
                const state = row.getValue('shipping_address') as Address;
                return <div className="max-w-[220px]">{`${state.dst}`}</div>;
            },
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
            accessorKey: 'gstin',
            header: 'GSTIN',
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
        userRole === 'org:admin'
            ? {
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
                                      onClick={() =>
                                          handleAssignDistributorToDealer(
                                              dealer.dealer_id,
                                              dealer.business_name
                                          )
                                      }
                                      className="flex justify-between items-center cursor-pointer"
                                  >
                                      Remove Distributor
                                      <UserRoundX className="ml-2 h-4 w-4" />
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
              }
            : {
                  id: '-',
                  header: '',
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
                        placeholder="Search distributors..."
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
                            onClick={() => navigate('/customers/dealers/approved')}
                            size="sm"
                            className="rounded"
                            variant="outline"
                        >
                            Approved Dealers
                        </Button>
                        <Button
                            onClick={() => navigate('/customers/dealers/not-approved')}
                            size="sm"
                            className="rounded"
                            variant="outline"
                        >
                            Disapproved Dealers
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
                        <Button variant="outline" className="rounded flex items-center gap-2">
                            Sort By <ChevronDown size={16} />
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
                                            <span className="text-center">No Distributors Found</span>
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

export default FetchAllDistributors;
