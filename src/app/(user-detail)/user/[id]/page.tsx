import NotFound from 'next/dist/client/components/builtin/not-found';

import { ProfileOverview } from '@/modules/user/components/profile-overview';
import { getUserByIdFacade } from '@/modules/user/facade';

const UserPage = async ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = await params;

	const user = await getUserByIdFacade(Number(id));

	if (!user) {
		return NotFound();
	}

	return (
		<div>
			<ProfileOverview user={user} />
			{/*TODO: list of user's reported issues*/}
		</div>
	);
};

export default UserPage;
