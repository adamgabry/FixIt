import NotFound from 'next/dist/client/components/builtin/not-found';

import { ProfileOverview } from '@/modules/user/components/profile-overview';
import { getUserByIdFacade } from '@/modules/user/facade';
import { IssueList } from '@/modules/issue/components/issue-list';
import { getIssuesFromUserFacade } from '@/modules/issue/facade';

const UserPage = async ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = await params;

	const user = await getUserByIdFacade(id);

	if (!user) {
		return NotFound();
	}

	const issuesReportedByUser = await getIssuesFromUserFacade(user.id);

	return (
		<div>
			<ProfileOverview user={user} />
			<IssueList issues={issuesReportedByUser} />
		</div>
	);
};

export default UserPage;
