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
import { ChevronDown, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SidebarCustomer() {
    const [selectedItem, setSelectedItem] = React.useState('');

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    className="bg-transparent text-stone-800 dark:text-stone-100 hover:bg-transparent w-full shadow-none flex justify-between items-center px-2 py-3 text-base font-normal p-2"
                    style={{ lineHeight: '1.5rem' }}
                >
                    <span className="flex items-center gap-x-2 text-lg font-work">
                        <Users size={20} className="min-w-[20px] min-h-[20px] stroke-[1.5] mr-2" />
                        Customers
                    </span>
                    <ChevronDown size={20} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="lg:w-48 shadow-md rounded-xl font-work">
                <DropdownMenuLabel>Customers Menu</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuRadioGroup value={selectedItem} onValueChange={setSelectedItem}>
                    <Link to="/customers">
                        <DropdownMenuRadioItem className="cursor-pointer" value="all">
                            All Customers
                        </DropdownMenuRadioItem>
                    </Link>
                    <Link to="/customers/distributors">
                        <DropdownMenuRadioItem className="cursor-pointer" value="distributor">
                            Distributors
                        </DropdownMenuRadioItem>
                    </Link>
                    <Link to="/customers/dealers/approved">
                        <DropdownMenuRadioItem className="cursor-pointer" value="approved-dealer">
                            Approved Dealers
                        </DropdownMenuRadioItem>
                    </Link>
                    <Link to="/customers/dealers/not-approved">
                        <DropdownMenuRadioItem className="cursor-pointer" value="not-approved-dealer">
                            Not Approved Dealers
                        </DropdownMenuRadioItem>
                    </Link>
                    <Link to="/customers/technicians">
                        <DropdownMenuRadioItem className="cursor-pointer" value="tech">
                            Technicians
                        </DropdownMenuRadioItem>
                    </Link>
                    <Link to="/customers/backoffices">
                        <DropdownMenuRadioItem className="cursor-pointer" value="back-office">
                            Back Offices
                        </DropdownMenuRadioItem>
                    </Link>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
