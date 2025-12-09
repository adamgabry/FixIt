import NotFound from 'next/dist/client/components/builtin/not-found';

import { ProfileOverview } from '@/modules/user/components/profile-overview';
import { getUserByIdFacade } from '@/modules/user/facade';
import { IssueList } from '@/modules/issue/components/issue-list';
import { getIssuesFromUserFacade } from '@/modules/issue/facade';
import { getSession } from '@/modules/auth/server';

const UserPage = async ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = await params;

	const user = await getUserByIdFacade(id);

	if (!user) {
		return NotFound();
	}

	const issuesReportedByUser = await getIssuesFromUserFacade(user.id);
	const session = await getSession();
	const currentUserId = session?.user?.id ?? null;

	return (
		<div className="space-y-6">
			<ProfileOverview user={user} />
			
			<div className="px-6">
				<h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
					Reported issues
					{issuesReportedByUser.length > 0 && (
						<span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm font-semibold rounded-full">
							{issuesReportedByUser.length}
						</span>
					)}
				</h2>
			</div>
			
			{issuesReportedByUser.length > 0 ? (
				<IssueList issues={issuesReportedByUser} currentUserId={currentUserId} />
			) : (
				<div className="mx-6">
					<div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-200 shadow-sm">
						<p className="text-gray-500 text-lg">No issues reported yet</p>
					</div>
				</div>
			)}
		</div>
	);
};

export default UserPage;
