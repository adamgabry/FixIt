import {
	createLike,
	deleteLike,
	getIssuesLikedByUser,
	getLikeByUserAndIssue,
	getUsersWhoLikedIssue,
	updateLike
} from '@/modules/issueLike/server';
import { type User } from '@/modules/user/schema';
import { getUserByIdFacade } from '@/modules/user/facade';
import { getIssueByIdFacade } from '@/modules/issue/facade';
import { type Issue } from '@/modules/issue/schema';
import {
	type IssueLike,
	type IssueLikeValuesSchema
} from '@/modules/issueLike/schema';

export const getIssuesLikedByUserFacade = async (
	userId: string
): Promise<Issue[]> => {
	const likes = await getIssuesLikedByUser(userId);

	const issues: (Issue | null)[] = await Promise.all(
		likes.map(async like => getIssueByIdFacade(like.issueId))
	);

	// filter out null if issue was deleted
	return issues.filter((issue): issue is Issue => issue !== null);
};

export const getUsersWhoLikedIssueFacade = async (
	issueId: number
): Promise<User[]> => {
	const likes = await getUsersWhoLikedIssue(issueId);

	const users: (User | null)[] = await Promise.all(
		likes.map(async like => getUserByIdFacade(like.userId))
	);

	// filter out any null if user was deleted
	return users.filter((user): user is User => user !== null);
};

export const getLikeByUserAndIssueFacade = async (
	userId: string,
	issueId: number
): Promise<IssueLike | null> => {
	const like = await getLikeByUserAndIssue(userId, issueId);

	if (!like) return null;

	const user = await getUserByIdFacade(userId);
	const issue = await getIssueByIdFacade(issueId);

	if (!user || !issue) return null;

	return { user, issue };
};

export const createLikeFacade = async (
	data: IssueLikeValuesSchema
): Promise<IssueLike> => {
	const like = await createLike(data);

	const user = await getUserByIdFacade(like.userId);
	const issue = await getIssueByIdFacade(like.issueId);

	if (!user || !issue) {
		throw new Error('User or Issue not found for the created like');
	}

	return { user, issue };
};

export const updateLikeFacade = async (
	userId: string,
	issueId: number,
	data: Partial<IssueLikeValuesSchema>
): Promise<IssueLike> => {
	const like = await updateLike(userId, issueId, data);

	const user = await getUserByIdFacade(like.userId);
	const issue = await getIssueByIdFacade(like.issueId);

	if (!user || !issue) {
		throw new Error('User or Issue not found for the updated like');
	}

	return { user, issue };
};

export const deleteLikeFacade = async (userId: string, issueId: number) => {
	await deleteLike(userId, issueId);
};
