import NotFound from 'next/dist/client/components/builtin/not-found';

import { getIssueByIdFacade } from '@/modules/issue/facade';
import IssueDetailView from '@/modules/issue/components/issue-detail-view';

const IssueDetailPage = async ({
	params
}: {
	params: Promise<{ id: string }>;
}) => {
	const { id } = await params;

	const issue = await getIssueByIdFacade(Number(id));
	if (!issue) return NotFound();

	return (
		<div className="min-h-screen w-full flex justify-center">
			<IssueDetailView issue={issue} />
		</div>
	);
};

export default IssueDetailPage;
