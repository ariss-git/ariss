import { Bell } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getAllUnreadNotifications, readAllNotification } from '../api/notificationAPI';

interface Notifications {
    notification_id: string;
    title: string;
    description: string;
    createdAt: string;
}

const Notification = () => {
    const navigate = useNavigate();
    const [data, setData] = useState<Notifications[]>([]);
    const [_loading, setLoading] = useState(false);

    useEffect(() => {
        const loadNotifications = async () => {
            setLoading(true);
            try {
                const res = await getAllUnreadNotifications();
                setData(res.data.data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        loadNotifications();
        const interval = setInterval(loadNotifications, 2000);
        return () => clearInterval(interval);
    }, []);

    const handleRead = async () => {
        try {
            await readAllNotification();
            console.log('Read all the notifications');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="relative cursor-pointer">
                    <Bell
                        size={16}
                        className="text-stone-100 dark:text-stone-100 stroke-[1.5] lg:mr-6 mr-3"
                    />
                    {data.length > 0 && (
                        <span className="absolute top-0 lg:right-6 right-3 block h-2 w-2 rounded-full bg-orange-500" />
                    )}
                </div>
            </DialogTrigger>

            <DialogContent className="lg:w-[80%] w-[90%] h-[60%] lg:h-[400px] rounded-lg shadow-md overflow-y-auto z-50 flex justify-start items-start flex-col gap-y-2 font-work">
                {data.length === 0 && (
                    <div className="flex justify-center items-center w-full h-full">
                        <h6 className="text-lg font-semibold text-center">
                            No Notifications in inbox right now.
                        </h6>
                    </div>
                )}
                {data.slice(0, 5).map((notify) => (
                    <div
                        key={notify.notification_id}
                        className="px-6 py-2.5 border border-muted-foreground/50 flex justify-start items-start flex-col w-full mt-6 shadow rounded"
                    >
                        <h6 className="text-lg font-semibold">{notify.title}</h6>
                        <p className="text-sm text-muted-foreground">{notify.description}.</p>
                        <div className="flex justify-between items-center w-full mt-4">
                            <span className="text-xs text-muted-foreground" />
                            <p className="text-xs text-muted-foreground">{notify.createdAt.split('T')[0]}</p>
                        </div>
                    </div>
                ))}
                {data.length >= 3 && (
                    <div className="flex justify-between items-center w-full mt-6">
                        <Button onClick={handleRead}>Mark As Read</Button>
                        <Button variant="link" onClick={() => navigate('/notifications')}>
                            View All
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default Notification;
