import {
	createIssue,
	deleteIssue,
	getIssueById,
	getIssues,
	getIssuesFiltered,
	getIssuesFromUser,
	updateIssue
} from '@/modules/issue/server';
import {
	type Issue,
	type IssueStatus,
	type IssueType,
	type IssueValuesSchema
} from '@/modules/issue/schema';
import { getUsersWhoLikedIssueFacade } from '@/modules/issueLike/facade';
import { getUserByIdFacade } from '@/modules/user/facade';
import { type IssueRow } from '@/db/schema/issues';
import { getPicturesByIssueFacade } from '@/modules/issuePicture/facade';
import { requireAuth, requireStaff } from '@/modules/auth/server';

const mapIssueRowToIssue = async (issue: IssueRow): Promise<Issue> => {
	const reporter = await getUserByIdFacade(issue.reporterId);
	if (!reporter) {
		throw new Error(
			`Reporter with id ${issue.reporterId} not found for issue ${issue.id}`
		);
	}

	const upvoters = await getUsersWhoLikedIssueFacade(issue.id);

	const pictures = await getPicturesByIssueFacade(issue.id);
	const pictureUrls = pictures.map(pic => pic.url);

	return {
		id: issue.id,
		title: issue.title,
		description: issue.description,
		latitude: issue.latitude,
		longitude: issue.longitude,
		type: issue.type,
		status: issue.status,
		pictureUrls,
		upvoters,
		numberOfUpvotes: upvoters.length,
		reporter,
		createdAt: new Date(issue.createdAt * 1000).toISOString(),
		updatedAt: new Date(issue.updatedAt * 1000).toISOString()
	};
};

const requireIssueModifyPermission = async (issue: IssueRow) => {
	const session = await requireAuth();
	const isOwner = issue.reporterId === session.user.id;

	if (!isOwner) {
		await requireStaff();
	}
};

export const getIssuesFacade = async (): Promise<Issue[]> => {
	const issues = await getIssues();
	return await Promise.all(issues.map(mapIssueRowToIssue));
};

export const getIssueByIdFacade = async (id: number): Promise<Issue | null> => {
	const issue = await getIssueById(id);
	if (!issue) return null;
	return await mapIssueRowToIssue(issue);
};

export const getIssuesFilteredFacade = async ({
	statuses,
	types
}: {
	statuses?: IssueStatus[] | null;
	types?: IssueType[] | null;
}) => {
	const rows = await getIssuesFiltered({
		statuses: statuses ?? null,
		types: types ?? null
	});

	return Promise.all(rows.map(mapIssueRowToIssue));
};

export const getIssuesFromUserFacade = async (
	userId: string
): Promise<Issue[]> => {
	const issues = await getIssuesFromUser(userId);
	return await Promise.all(issues.map(mapIssueRowToIssue));
};

export const createIssueFacade = async (data: IssueValuesSchema) => {
	const session = await requireAuth();

	const issue = await createIssue({ ...data, reporterId: session.user.id });
	return await mapIssueRowToIssue(issue);
};

export const updateIssueFacade = async (
	issueId: number,
	data: Partial<IssueValuesSchema>
) => {
	const issue = await getIssueById(issueId);

	if (!issue) {
		throw new Error('Issue not found');
	}

	await requireIssueModifyPermission(issue);

	const updatedIssue = await updateIssue(issueId, data as IssueValuesSchema);
	return await mapIssueRowToIssue(updatedIssue);
};

export const deleteIssueFacade = async (id: number) => {
	const issue = await getIssueById(id);

	if (!issue) {
		throw new Error('Issue not found');
	}

	await requireIssueModifyPermission(issue);

	await deleteIssue(id);
	return { success: true };
};
