import { Bell } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

const Notification = () => {
    const navigate = useNavigate();

    return (
        <Dialog>
            <DialogTrigger>
                <Bell size={16} className="text-stone-100 dark:text-stone-100 stroke-[1.5] lg:mr-6 mr-3" />
            </DialogTrigger>
            <DialogContent className="lg:w-[80%] w-[90%] h-[60%] lg:h-[400px] rounded-lg shadow-md overflow-y-auto z-50 flex justify-start items-start flex-col gap-y-2 font-work">
                <div className="px-6 py-2.5 border border-muted-foreground/50 flex justify-start items-start flex-col w-full mt-6 shadow rounded">
                    <h6 className="text-lg font-semibold">Title</h6>
                    <p className="text-sm text-muted-foreground">Description</p>
                    <div className="flex justify-between items-center w-full mt-4">
                        <span className="text-xs text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">24-24-24</p>
                    </div>
                </div>
                <div className="flex justify-between items-center w-full mt-6">
                    <Button>Mark As Read</Button>
                    <Button variant="link" onClick={() => navigate('/notifications')}>
                        View All
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default Notification;
