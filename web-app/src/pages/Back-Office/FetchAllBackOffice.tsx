import { useEffect, useState } from 'react';
import {
    approveBackOffice,
    deleteBackOffice,
    disApproveBackOffice,
    getAllBackOffices,
} from '../../api/customerAPI';
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
import {
    ChevronDown,
    Eye,
    Trash,
    MoreHorizontal,
    ShieldX,
    ShieldPlus,
    Pencil,
    Loader2,
    PlusCircle,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from '../../hooks/use-toast';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../../components/ui/dialog';
import { useOrganization, useUser } from '@clerk/clerk-react';

interface BackOffice {
    backoffice_id: string;
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
    isApproved: boolean;
    profile_pic: string | null;
    usertype: string;
    createdAt: string;
    dealerid: string;
    dealer: {
        first_name: string;
        last_name: string;
        email: string;
        phone: string;
        gstin: string;
        business_name: string;
    };
}

const FetchAllBackOffices = () => {
    const [data, setData] = useState<BackOffice[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const [globalFilter, setGlobalFilter] = useState('');
    const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
        createdAt: false,
        dealerFname: false,
        dealerLname: false,
        dealerPhone: false,
        dealerEmail: false,
        dealerID: false,
    });

    const { user } = useUser();
    const { organization } = useOrganization();

    // Find the user's membership in the current organization
    const userMembership = user?.organizationMemberships.find(
        (membership) => membership.organization.id === organization?.id
    );

    // Get the role key string from the membership
    const userRole = userMembership?.role;

    const [showModal, setShowModal] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [confirmText, setConfirmText] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await getAllBackOffices();
                if (res.data.success) {
                    setData(res.data.data);
                }
            } catch (err) {
                console.error('Failed to fetch back offices:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleConfirmDelete = async () => {
        if (confirmText !== 'confirm' || !selectedId) return;
        setLoading(true);
        try {
            await deleteBackOffice(selectedId);
            toast({
                description: 'Back office deleted successfully',
                className: 'font-work rounded border',
            });
            setData((prev) => prev.filter((bo) => bo.backoffice_id !== selectedId));
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                description: 'Error deleting back office',
                className: 'font-work rounded border',
            });
        } finally {
            setLoading(false);
            setConfirmText('');
            setSelectedId(null);
            setShowModal(false);
        }
    };

    // Approve a back office
    const handleApproval = async (dealer_id: string, backoffice_id: string, business_name: string) => {
        if (!dealer_id) return;
        if (!backoffice_id) return;
        setLoading(true);
        try {
            await approveBackOffice(dealer_id, backoffice_id);

            setTimeout(() => {
                location.reload();
            }, 800);

            toast({
                title: `${business_name} - Back Office approved`,
                description: 'Back Office has been approved successfully.',
                className: 'bg-green-500 text-white font-work rounded shadow-md',
            });
        } catch (error) {
            console.error(error);
            toast({
                title: `Back Office approval failed`,
                description: 'Kindly check logs and try again later.',
                className: 'bg-red-500 text-white font-work rounded shadow-md',
            });
        } finally {
            setLoading(false);
        }
    };

    // Disapprove a back office
    const handleDisapproval = async (dealer_id: string, backoffice_id: string, business_name: string) => {
        if (!dealer_id) return;
        if (!backoffice_id) return;
        setLoading(true);
        try {
            await disApproveBackOffice(dealer_id, backoffice_id);

            setTimeout(() => {
                location.reload();
            }, 800);

            toast({
                title: `${business_name} - Back Office disapproved`,
                description: 'Back Office has been disapproved successfully.',
                className: 'bg-green-500 text-white font-work rounded shadow-md',
            });
        } catch (error) {
            console.error(error);
            toast({
                title: `Back Office disapproval failed`,
                description: 'Kindly check logs and try again later.',
                className: 'bg-red-500 text-white font-work rounded shadow-md',
            });
        } finally {
            setLoading(false);
        }
    };

    const columns: ColumnDef<BackOffice>[] = [
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
        },
        {
            accessorKey: 'last_name',
            header: 'Last Name',
        },
        {
            accessorKey: 'dealer.business_name',
            header: 'Business',
            cell: ({ row }) => row.original.dealer?.business_name || '—',
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
            accessorKey: 'dealer.gstin',
            header: 'GSTIN',
            cell: ({ row }) => row.original.dealer?.gstin || '—',
        },
        {
            accessorKey: 'dealer.first_name',
            header: 'Dealer First Name',
            id: 'dealerFname',
            cell: ({ row }) => row.original.dealer?.first_name || '—',
        },
        {
            accessorKey: 'dealer.last_name',
            header: 'Dealer Last Name',
            id: 'dealerLname',
            cell: ({ row }) => row.original.dealer?.last_name || '—',
        },
        {
            accessorKey: 'dealer.phone',
            header: 'Dealer Phone',
            id: 'dealerPhone',
            cell: ({ row }) => row.original.dealer?.phone || '—',
        },
        {
            accessorKey: 'dealer.email',
            header: 'Dealer Email',
            id: 'dealerEmail',
            cell: ({ row }) => row.original.dealer?.email || '—',
        },
        {
            accessorKey: 'dealerid',
            header: 'Dealer ID',
            id: 'dealerID',
        },
        {
            accessorKey: 'isApproved',
            header: 'Approved',
            cell: ({ row }) =>
                row.original.isApproved ? (
                    <Badge className="rounded">Yes</Badge>
                ) : (
                    <Badge className="rounded" variant="outline">
                        No
                    </Badge>
                ),
        },
        {
            accessorKey: 'createdAt',
            header: 'Date',
            cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
        },
        userRole === 'org:admin'
            ? {
                  id: 'actions',
                  header: 'Actions',
                  cell: ({ row }) => {
                      const backoffice = row.original;
                      return (
                          <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                                      <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="rounded font-work">
                                  <DropdownMenuItem className="flex justify-between items-center cursor-pointer">
                                      <Link to={`/customers/backoffices/${backoffice.backoffice_id}`}>
                                          View
                                      </Link>
                                      <Eye className="mr-2 h-4 w-4" />
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                      onClick={() =>
                                          handleApproval(
                                              backoffice.dealerid,
                                              backoffice.backoffice_id,
                                              backoffice.dealer.business_name
                                          )
                                      }
                                      className="flex justify-between items-center cursor-pointer"
                                  >
                                      Approve
                                      <ShieldPlus className="mr-2 h-4 w-4" />
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                      onClick={() =>
                                          handleDisapproval(
                                              backoffice.dealerid,
                                              backoffice.backoffice_id,
                                              backoffice.dealer.business_name
                                          )
                                      }
                                      className="flex justify-between items-center cursor-pointer"
                                  >
                                      Disapprove
                                      <ShieldX className="mr-2 h-4 w-4" />
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="flex justify-between items-center cursor-pointer">
                                      Edit
                                      <Pencil className="mr-2 h-4 w-4" />
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                      onClick={() => {
                                          setSelectedId(backoffice.backoffice_id);
                                          setShowModal(true);
                                      }}
                                      className="flex justify-between items-center cursor-pointer text-red-500"
                                  >
                                      Delete
                                      <Trash className="mr-2 h-4 w-4 text-red-500" />
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
                        placeholder="Search back offices..."
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
                    </div>
                </div>
                <DropdownMenu>
                    <div className="flex justify-center items-center gap-x-4">
                        <Button
                            variant="default"
                            className="rounded"
                            onClick={() => navigate('/customers/backoffices/add')}
                        >
                            Add Customer <PlusCircle className="ml-2 h-4 w-4" />
                        </Button>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="rounded flex items-center gap-2">
                                Sort By <ChevronDown size={16} />
                            </Button>
                        </DropdownMenuTrigger>
                    </div>
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
                                            <span className="text-center">No Backoffices Found</span>
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

            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent className="font-work rounded">
                    <DialogHeader>
                        <DialogTitle>Delete Backoffice Menu</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                        Once you delete this Backoffice, there is no going back.
                    </DialogDescription>
                    <Input
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        placeholder='Type "confirm" to proceed'
                        className="rounded"
                    />
                    <DialogFooter>
                        <Button
                            variant="destructive"
                            disabled={confirmText !== 'confirm' || loading}
                            onClick={handleConfirmDelete}
                            className="font-work rounded"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default FetchAllBackOffices;
