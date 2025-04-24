import * as React from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
} from '../../components/ui/dropdown-menu';

import { Button } from '../../components/ui/button';
import { ChevronDown, BookCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SidebarCourse() {
    const [selectedItem, setSelectedItem] = React.useState('');

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    className="bg-transparent text-stone-800 dark:text-stone-100 hover:bg-transparent w-full shadow-none flex justify-between items-center px-2 py-3 text-base font-normal p-2"
                    style={{ lineHeight: '1.5rem' }}
                >
                    <span className="flex items-center gap-x-2 text-lg font-work">
                        <BookCheck size={20} className="min-w-[20px] min-h-[20px] stroke-[1.5] mr-2" />
                        Courses
                    </span>
                    <ChevronDown size={20} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="lg:w-48 shadow-md rounded-xl font-work">
                <DropdownMenuLabel>Courses Menu</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuRadioGroup value={selectedItem} onValueChange={setSelectedItem}>
                    <Link to="/courses">
                        <DropdownMenuRadioItem className="cursor-pointer" value="all">
                            All Courses
                        </DropdownMenuRadioItem>
                    </Link>
                    <Link to="/courses/add">
                        <DropdownMenuRadioItem className="cursor-pointer" value="add">
                            Add Course
                        </DropdownMenuRadioItem>
                    </Link>
                    <Link to="/courses/pass">
                        <DropdownMenuRadioItem className="cursor-pointer" value="pass">
                            Passed Tests
                        </DropdownMenuRadioItem>
                    </Link>
                    <Link to="/courses/fail">
                        <DropdownMenuRadioItem className="cursor-pointer" value="fail">
                            Failed Tests
                        </DropdownMenuRadioItem>
                    </Link>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
