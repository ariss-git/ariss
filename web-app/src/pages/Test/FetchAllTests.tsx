import { useEffect, useState } from 'react';
import { deleteQuestion, getAllQuestions } from '../../api/questionAPI';
import { useToast } from '../../hooks/use-toast';
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
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { Button } from '../../components/ui/button';
import { ChevronDown, Loader2, MoreHorizontal, Trash } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import AddTest from './AddTest';

type Tests = {
    test_id: string;
    question: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    correct_option: string;
    createdAt: string;
    course_id: string;
    course: {
        title: string;
    };
};

const FetchAllTests = () => {
    const [data, setData] = useState<Tests[]>([]);
    const [loading, setLoading] = useState(false);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

    const { toast } = useToast();

    const loadAllQuestions = async () => {
        setLoading(true);
        try {
            const response = await getAllQuestions();
            setData(response.data.data);
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                description: 'Failed to load Questions',
                className: 'rounded font-work',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (testId: string) => {
        setLoading(true);
        try {
            await deleteQuestion(testId);
            toast({
                variant: 'default',
                description: 'Question deleted successfully',
                className: 'rounded font-work bg-green-500 text-black',
            });
            loadAllQuestions();
        } catch (error) {
            console.error('Failed deleting question', error);
            toast({
                variant: 'destructive',
                description: 'Failed to delete Question',
                className: 'rounded font-work',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAllQuestions();
    }, []);

    const columns: ColumnDef<Tests>[] = [
        {
            accessorKey: 'question',
            header: 'Question',
        },
        {
            accessorFn: (row) => row.course.title,
            id: 'courseTitle',
            header: 'Course Title',
        },

        {
            accessorKey: 'option_a',
            header: 'Option A',
        },
        {
            accessorKey: 'option_b',
            header: 'Option B',
        },
        {
            accessorKey: 'option_c',
            header: 'Option C',
        },
        {
            accessorKey: 'option_d',
            header: 'Option D',
        },
        {
            accessorKey: 'correct_option',
            header: 'Correct Option',
        },
        {
            accessorKey: 'createdAt',
            header: 'Created On',
            cell: ({ row }) => <div>{new Date(row.getValue('createdAt')).toLocaleDateString()}</div>,
        },
        {
            header: 'Actions',
            id: 'actions',
            cell: ({ row }) => {
                const test = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded font-work">
                            <DropdownMenuItem
                                onClick={() => handleDelete(test.test_id)}
                                className="flex justify-between cursor-pointer text-red-500"
                            >
                                Delete{' '}
                                {loading ? (
                                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Trash className="ml-2 h-4 w-4" />
                                )}
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
                    placeholder="Search Questions..."
                    onChange={(e) => table.getColumn('question')?.setFilterValue(e.target.value)}
                    className="max-w-sm rounded lg:mt-0 mt-10 lg:mb-0 mb-6"
                />
                <DropdownMenu>
                    <div className="lg:flex hidden justify-center items-center lg:gap-x-6">
                        <AddTest />
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="rounded">
                                Filter By <ChevronDown className="ml-2 h-4 w-4" />
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
                                    {column.id.replace(/([A-Z])/g, ' $1').toLowerCase()}
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
                                    key={row.id}
                                    className="p-4 odd:bg-gray-100 even:bg-white dark:even:bg-stone-500/20 dark:odd:bg-stone-800 transition-colors"
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
                                            <span className="text-center">No Questions Found</span>
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

export default FetchAllTests;
