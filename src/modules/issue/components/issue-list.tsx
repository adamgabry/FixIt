import { IssueListItem } from '@/modules/issue/components/issue-list-item';
import { getIssuesFacade } from '@/modules/issue/facade';

export const IssueList = async () => {
	const issues = await getIssuesFacade();

	return (
		<ul className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
			{issues.map(issue => (
				<IssueListItem key={issue.id} issue={issue} />
			))}
		</ul>
	);
};
