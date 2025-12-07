import { IssueListFilters } from '@/modules/issue/components/issue-list-filters';
import { getIssuesFacade } from '@/modules/issue/facade';

import { IssuesListClient } from './issues-list-client';

const IssuesListPage = async () => {
	const issues = await getIssuesFacade();

	return (
		<div>
			<IssueListFilters initialIssues={issues} />
			<IssuesListClient />
		</div>
	);
};

export default IssuesListPage;
