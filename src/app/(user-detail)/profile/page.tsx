import NotFound from 'next/dist/client/components/builtin/not-found';

import { ProfileOverview } from '@/modules/user/components/profile-overview';
import { getUserByIdFacade } from '@/modules/user/facade';
import { IssueList } from '@/modules/issue/components/issue-list';
import { getIssuesFromUserFacade } from '@/modules/issue/facade';
import { TwoTabComponent } from '@/components/two-tab-component';
import { getIssuesLikedByUserFacade } from '@/modules/issueLike/facade';

const ProfilePage = async () => {
	//TODO: get currently logged in user
	const loggedInUser = await getUserByIdFacade(1);

	if (!loggedInUser) {
		//TODO: throw error
		return NotFound();
	}

	const issuesReportedByUser = await getIssuesFromUserFacade(loggedInUser.id);
	const issuesLikedByUser = await getIssuesLikedByUserFacade(loggedInUser.id);

	return (
		<div>
			<ProfileOverview user={loggedInUser} />
			<TwoTabComponent
				tab1Label={`Reported by ${loggedInUser.name}`}
				tab2Label={`Liked by ${loggedInUser.name}`}
				tab1Content={<IssueList issues={issuesReportedByUser} />}
				tab2Content={<IssueList issues={issuesLikedByUser} />}
			/>
		</div>
	);
};

export default ProfilePage;
