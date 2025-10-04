import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useOrganization, useUser } from '@clerk/clerk-react';

const Profile = () => {
    const { user } = useUser();
    const { organization } = useOrganization();

    // Find the user's membership in the current organization
    const userMembership = user?.organizationMemberships.find(
        (membership) => membership.organization.id === organization?.id
    );

    // Get the role key string from the membership
    const userRole = userMembership?.role;

    return (
        <div className="flex justify-start items-start flex-col lg:gap-y-6 gap-y-8 font-work lg:p-10 p-6">
            <div className="flex justify-start items-start w-full lg:mb-6 mb-2">
                <img
                    src={user?.imageUrl}
                    alt="Profile Picture"
                    width={100}
                    height={100}
                    style={{ borderRadius: '100%' }}
                />
            </div>

            <div className="flex justify-start items-start flex-col gap-y-2">
                <Label className="font-semibold">User ID</Label>
                <Input value={user?.id} disabled className="lg:w-[300px] w-[335px] rounded" />
            </div>

            <div className="flex justify-start items-start flex-col gap-y-2">
                <Label className="font-semibold">Fullname</Label>
                <Input value={user?.fullName!} disabled className="lg:w-[300px] w-[335px] rounded" />
            </div>

            <div className="flex justify-start items-start flex-col gap-y-2">
                <Label className="font-semibold">Email</Label>
                <Input
                    value={user?.emailAddresses[0].emailAddress}
                    disabled
                    className="lg:w-[300px] w-[335px] rounded"
                />
            </div>

            <div className="flex justify-start items-start flex-col gap-y-2">
                <Label className="font-semibold">Role</Label>
                <Input
                    value={userRole === 'org:admin' ? 'Admin' : 'Employee'}
                    disabled
                    className="lg:w-[300px] w-[335px] rounded"
                />
            </div>
        </div>
    );
};

export default Profile;
