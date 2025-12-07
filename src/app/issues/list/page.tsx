import { getIssuesFacade } from '@/modules/issue/facade';
import { IssuesListClient } from '@/app/issues/list/issues-list-client';

const IssuesListPage = async () => {
	const issues = await getIssuesFacade();

	return <IssuesListClient initialIssues={issues} />;
};

export default IssuesListPage;
