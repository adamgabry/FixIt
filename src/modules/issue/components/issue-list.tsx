import { IssueListItem } from '@/modules/issue/components/issue-list-item';
import { type Issue } from '@/modules/issue/schema';

export const IssueList = ({
	issues,
	currentUserId
}: {
	issues: Issue[];
	currentUserId: string | null;
}) => (
	<ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-3 md:p-6">
		{issues.map(issue => (
			<IssueListItem
				key={issue.id}
				issue={issue}
				currentUserId={currentUserId}
			/>
		))}
	</ul>
);
