import NotFound from 'next/dist/client/components/builtin/not-found';

import { getIssueByIdFacade } from '@/modules/issue/facade';
import IssueDetailView from '@/modules/issue/components/issue-detail-view';
import {
	getUserVoteValueFacade,
	getIssueVoteCountsFacade
} from '@/modules/issueLike/facade';

const IssueDetailPage = async ({
	params
}: {
	params: Promise<{ id: string }>;
}) => {
	const { id } = await params;

	const issue = await getIssueByIdFacade(Number(id));
	if (!issue) return NotFound();

	// TODO: Replace with real auth - get current user from session/cookies
	// For now, using userId=2 (Staff user) for testing
	// Set to null to test non-authenticated state
	const currentUserId = 2;

	// Fetch voting data
	const userVoteValue = currentUserId
		? await getUserVoteValueFacade(currentUserId, Number(id))
		: 0;
	const voteCounts = await getIssueVoteCountsFacade(Number(id));

	return (
		<div className="min-h-screen w-full flex justify-center">
			<IssueDetailView
				issue={issue}
				currentUserId={currentUserId}
				initialVoteValue={userVoteValue}
				initialVoteCounts={voteCounts}
			/>
		</div>
	);
};

export default IssueDetailPage;
