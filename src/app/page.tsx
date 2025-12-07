// src/app/page.tsx
import { MapView } from '@/modules/issue/components/map-view';
import { FloatingAddButton } from '@/components/floating-add-button';
import { getIssuesFacade } from '@/modules/issue/facade';
import {
	getUserVoteValueFacade,
	getIssueVoteCountsFacade
} from '@/modules/issueLike/facade';

const Home = async () => {
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
		<div className="flex h-[calc(100vh-80px)] -mx-4 -my-8 md:-mx-8">
			{/*
			<SidebarFilter
				filters={filters}
				onFiltersChangeAction={setFilters}
				issueCount={issues.length}
				filteredCount={filteredIssues.length}
			/>
			*/}
			<MapView issues={issuesWithVotes} currentUserId={currentUserId} />
			<FloatingAddButton />
		</div>
	);
};

export default Home;
