import { getIssuesFacade } from '@/modules/issue/facade';
import { IssuesListClient } from '@/app/issues/list/issues-list-client';
import { getSession } from '@/modules/auth/server';

const IssuesListPage = async () => {
	const issues = await getIssuesFacade();
	const session = await getSession();
	const currentUserId = session?.user?.id ?? null;

	return <IssuesListClient initialIssues={issues} currentUserId={currentUserId} />;
};

export default IssuesListPage;
