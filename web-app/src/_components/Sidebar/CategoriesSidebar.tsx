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
import { ChevronDown, Network } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SidebarCategory() {
    const [selectedItem, setSelectedItem] = React.useState('');

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    className="bg-transparent text-stone-800 dark:text-stone-100 hover:bg-transparent w-full shadow-none flex justify-between items-center px-2 py-3 text-base font-normal p-2"
                    style={{ lineHeight: '1.5rem' }}
                >
                    <span className="flex items-center gap-x-2 text-lg font-work">
                        <Network size={20} className="min-w-[20px] min-h-[20px] stroke-[1.5] mr-2" />
                        Categories
                    </span>
                    <ChevronDown size={20} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="lg:w-48 shadow-md rounded-xl font-work">
                <DropdownMenuLabel>Categories & Subcategories Menu</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuRadioGroup value={selectedItem} onValueChange={setSelectedItem}>
                    <Link to="/categories">
                        <DropdownMenuRadioItem className="cursor-pointer" value="all">
                            All Categories
                        </DropdownMenuRadioItem>
                    </Link>
                    <Link to="/categories/add">
                        <DropdownMenuRadioItem className="cursor-pointer" value="add">
                            Add Categories
                        </DropdownMenuRadioItem>
                    </Link>
                    <Link to="/subcategories">
                        <DropdownMenuRadioItem className="cursor-pointer" value="sub-all">
                            All Subcategories
                        </DropdownMenuRadioItem>
                    </Link>
                    <Link to="/subcategories/add">
                        <DropdownMenuRadioItem className="cursor-pointer" value="sub-add">
                            Add Subcategories
                        </DropdownMenuRadioItem>
                    </Link>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
