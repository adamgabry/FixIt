import { IssueListItem } from '@/modules/issue/components/issue-list-item';
import { getIssuesFacade } from '@/modules/issue/facade';
import {
	getUserVoteValueFacade,
	getIssueVoteCountsFacade
} from '@/modules/issueLike/facade';

export const IssueList = async () => {
	const issues = await getIssuesFacade();

	// TODO: Replace with real auth - get current user from session/cookies
	const currentUserId = 2; // Using Staff user for testing

	// Fetch vote data for each issue
	const issuesWithVotes = await Promise.all(
		issues.map(async issue => {
			const userVoteValue = currentUserId
				? await getUserVoteValueFacade(currentUserId, issue.id)
				: 0;
			const voteCounts = await getIssueVoteCountsFacade(issue.id);

			return {
				issue,
				userVoteValue,
				voteScore: voteCounts.score
			};
		})
	);

	return (
		<ul className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
			{issuesWithVotes.map(({ issue, userVoteValue, voteScore }) => (
				<IssueListItem
					key={issue.id}
					issue={issue}
					currentUserId={currentUserId}
					userVoteValue={userVoteValue}
					voteScore={voteScore}
				/>
			))}
		</ul>
	);
};
