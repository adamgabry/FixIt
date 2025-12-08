import { redirect } from 'next/navigation';

import { ProfileOverview } from '@/modules/user/components/profile-overview';
import { IssueList } from '@/modules/issue/components/issue-list';
import { getIssuesFromUserFacade } from '@/modules/issue/facade';
import { TwoTabComponent } from '@/components/two-tab-component';
import { getIssuesLikedByUserFacade } from '@/modules/issueLike/facade';
import { requireAuth } from '@/modules/auth/server';

const ProfilePage = async () => {
	const session = await requireAuth();

	if (!session) {
		redirect('/login');
	}

	const loggedInUser = session.user;

	const issuesReportedByUser = await getIssuesFromUserFacade(loggedInUser.id);
	const issuesLikedByUser = await getIssuesLikedByUserFacade(loggedInUser.id);

	return (
		<div>
			<ProfileOverview user={loggedInUser} />
			<TwoTabComponent
				tab1Label="Reported by me"
				tab2Label="Liked by me"
				tab1Content={<IssueList issues={issuesReportedByUser} />}
				tab2Content={<IssueList issues={issuesLikedByUser} />}
			/>
		</div>
	);
};

export default ProfilePage;
