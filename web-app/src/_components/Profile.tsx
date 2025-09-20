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
        <div className="flex justify-start items-start flex-col gap-y-4">
            <h1>ID: {user?.id}</h1>
            <h1>Email: {user?.emailAddresses[0].emailAddress}</h1>
            <h1>Name: {user?.fullName}</h1>
            <h1 className="truncate max-w-[300px]">Profile Pic: {user?.imageUrl}</h1>
            {userRole === 'org:admin' ? <h1>Role: ADMIN</h1> : <h1>Role: Employee</h1>}
        </div>
    );
};

export default Profile;
