import NotFound from 'next/dist/client/components/builtin/not-found';

import { ProfileOverview } from '@/modules/user/components/profile-overview';
import { getUserByIdFacade } from '@/modules/user/facade';
import { LogOutButton } from '@/modules/auth/components/log-out-button';

const ProfilePage = async () => {
	//TODO: get currently logged in user
	const loggedInUser = await getUserByIdFacade(1);

	if (!loggedInUser) {
		//TODO: throw error
		return NotFound();
	}

	return (
		<div>
			<ProfileOverview user={loggedInUser} />
			<LogOutButton />
			{/*TODO: list of user's reported issues*/}
		</div>
	);
};

export default ProfilePage;
