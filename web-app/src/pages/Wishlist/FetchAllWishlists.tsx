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
import { ChevronDown, MoreHorizontal, Eye, CheckCheck, X, Trash, Loader2, PlusCircle } from 'lucide-react';
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
import { useNavigate } from 'react-router-dom';
import { Badge } from '../../components/ui/badge';
import { deleteCourse, getAllCourses, publishCourse, unpublishCourse } from '../../api/courseAPI';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';

type Course = {
    course_id: string;
    title: string;
    isPublished: boolean;
    createdAt: string;
};

export default function FetchAllWishlists() {
    const [data, setData] = useState<Course[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({ course_id: false });
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [confirmText, setConfirmText] = useState('');
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

    const load = async () => {
        setLoading(true);
        try {
            const res = await getAllCourses();
            setData(res.data.data);
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                description: 'Failed to load Courses',
                className: 'rounded font-work',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const handlePublishCourse = async (course_id: string) => {
        if (!course_id) return;
        setLoading(true);
        try {
            await publishCourse(course_id);
            toast({
                description: 'Course has been published',
                className: 'rounded font-work bg-green-500 border',
            });
            load();
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                description: 'Failed to publish Course',
                className: 'rounded font-work',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleUnpublishCourse = async (course_id: string) => {
        if (!course_id) return;
        setLoading(true);
        try {
            await unpublishCourse(course_id);
            toast({
                description: 'Course has been unpublished',
                className: 'rounded font-work bg-green-500 border',
            });
            load();
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                description: 'Failed to unpublish Course',
                className: 'rounded font-work',
            });
        } finally {
            setLoading(false);
        }
    };

    const confirmDeleteCourse = async () => {
        if (confirmText.toLowerCase() !== 'confirm' || !selectedCourseId) return;
        setLoading(true);
        try {
            await deleteCourse(selectedCourseId);
            toast({
                description: 'Course has been deleted successfully',
                className: 'rounded font-work bg-green-500 border',
            });
            load();
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                description: 'Failed to delete Course',
                className: 'rounded font-work',
            });
        } finally {
            setLoading(false);
            setIsDialogOpen(false);
            setConfirmText('');
            setSelectedCourseId(null);
        }
    };

    const columns: ColumnDef<Course>[] = [
        {
            accessorKey: 'course_id',
            header: 'Course ID',
            cell: ({ row }) => <div className="truncate max-w-[180px]">{row.getValue('course_id')}</div>,
        },
        {
            accessorKey: 'title',
            header: 'Course Title',
        },
        {
            accessorKey: 'isPublished',
            header: 'Published',
            cell: ({ row }) => {
                const value = row.getValue('isPublished');
                return (
                    <Badge className="rounded" variant={value ? 'default' : 'secondary'}>
                        {value ? 'Yes' : 'No'}
                    </Badge>
                );
            },
        },
        {
            accessorKey: 'createdAt',
            header: 'Created Date',
            cell: ({ row }) => <div>{new Date(row.getValue('createdAt')).toLocaleDateString()}</div>,
        },
        {
            header: 'Actions',
            id: 'actions',
            cell: ({ row }) => {
                const course = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded font-work">
                            <DropdownMenuItem
                                onClick={() => navigate(`/courses/${course.course_id}`)}
                                className="flex justify-between cursor-pointer"
                            >
                                <h6>View</h6>
                                <Eye className="ml-2 h-4 w-4" />
                            </DropdownMenuItem>
                            {/* <DropdownMenuItem className="flex justify-between cursor-pointer">
                                <Link to={`/courses/${course.course_id}`}>Update</Link>{' '}
                                <Pencil className="ml-2 h-4 w-4" />
                            </DropdownMenuItem> */}
                            <DropdownMenuItem
                                onClick={() => handlePublishCourse(course.course_id)}
                                disabled={loading}
                                className="flex justify-between cursor-pointer"
                            >
                                Publish Course{' '}
                                {loading ? (
                                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <CheckCheck className="ml-2 h-4 w-4" />
                                )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleUnpublishCourse(course.course_id)}
                                className="flex justify-between cursor-pointer"
                            >
                                Unpublish Course <X className="ml-2 h-4 w-4" />
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    setIsDialogOpen(true);
                                    setSelectedCourseId(course.course_id);
                                }}
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
        <>
            <div className="w-full font-work space-y-4">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                    <Input
                        placeholder="Search Course..."
                        onChange={(e) => table.getColumn('title')?.setFilterValue(e.target.value)}
                        className="max-w-sm rounded"
                    />
                    <DropdownMenu>
                        <div className="flex justify-center items-center lg:gap-x-6">
                            <Button
                                variant="default"
                                className="rounded"
                                onClick={() => navigate('/courses/add')}
                            >
                                Add Course <PlusCircle className="ml-2 h-4 w-4" />
                            </Button>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="rounded">
                                    Filter <ChevronDown className="ml-2 h-4 w-4" />
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
                                            <TableCell
                                                key={cell.id}
                                                className="whitespace-nowrap text-sm p-4"
                                            >
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
                                                <span className="text-center">No Courses Found</span>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="rounded font-work max-w-md">
                    <DialogHeader>
                        <DialogTitle>Are you sure you want to delete this course?</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <Label htmlFor="confirm" className="text-sm font-medium">
                            Type <span className="font-bold text-red-500">confirm</span> to proceed
                        </Label>
                        <Input
                            id="confirm"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            placeholder="confirm"
                            className="rounded"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded">
                            Cancel
                        </Button>
                        <Button
                            onClick={confirmDeleteCourse}
                            className="bg-red-500 hover:bg-red-600 text-white rounded"
                            disabled={confirmText.toLowerCase() !== 'confirm' || loading}
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
