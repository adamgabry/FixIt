import NotFound from 'next/dist/client/components/builtin/not-found';

import { getIssueByIdFacade } from '@/modules/issue/facade';
import IssueDetailView from '@/modules/issue/components/issue-detail-view';

const IssueDetailPage = async ({
	params,
	searchParams
}: {
	params: Promise<{ id: string }>;
	searchParams: Promise<{ edit?: string }>;
}) => {
	const { id } = await params;
	const { edit } = await searchParams;

	const issue = await getIssueByIdFacade(Number(id));
	if (!issue) return NotFound();

	const initialEditMode = edit === 'true';

	return <IssueDetailView issue={issue} initialEditMode={initialEditMode} />;
};

export default IssueDetailPage;
