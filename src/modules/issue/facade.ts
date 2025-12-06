import {
	createIssue,
	deleteIssue,
	getIssueById,
	getIssues,
	updateIssue
} from '@/modules/issue/server';
import { type Issue, type IssueValuesSchema } from '@/modules/issue/schema';
import { getUserByIdFacade } from '@/modules/user/facade';
import { type IssueRow } from '@/db/schema/issues';

const mapIssueValuesSchemaToIssue = async (issue: IssueRow): Promise<Issue> => {
	const reporter = await getUserByIdFacade(issue.reporterId);
	if (!reporter) {
		throw new Error(
			`Reporter with id ${issue.reporterId} not found for issue ${issue.id}`
		);
	}
	/*
	const pictures = await db.select().from(issuePictures).where(eq(issuePictures.issueId, id));
	const likes = await db.select().from(issueLikes).where(eq(issueLikes.issueId, id));
	*/

	return {
		id: issue.id,
		title: issue.title,
		description: issue.description,
		latitude: issue.latitude,
		longitude: issue.longitude,
		type: issue.type,
		status: issue.status,
		pictureUrls: [], // TODO map real pictures: issue.pictures.map(p => p.url)
		numberOfUpvotes: 100, // TODO count likes
		reporter,
		createdAt: new Date(issue.createdAt * 1000),
		updatedAt: new Date(issue.updatedAt * 1000)
	};
};

export const getIssuesFacade = async (): Promise<Issue[]> => {
	const issues = await getIssues();
	return await Promise.all(issues.map(mapIssueValuesSchemaToIssue));
};

export const getIssueByIdFacade = async (id: number): Promise<Issue | null> => {
	const issue = await getIssueById(id);
	if (!issue) return null;
	return await mapIssueValuesSchemaToIssue(issue);
};

export const createIssueFacade = async (data: IssueValuesSchema) => {
	const issue = await createIssue(data);
	return await mapIssueValuesSchemaToIssue(issue);
};

export const updateIssueFacade = async (
	id: number,
	data: Partial<IssueValuesSchema>
) => {
	const issue = await updateIssue(id, data as IssueValuesSchema);
	return await mapIssueValuesSchemaToIssue(issue);
};

export const deleteIssueFacade = async (id: number) => deleteIssue(id);
