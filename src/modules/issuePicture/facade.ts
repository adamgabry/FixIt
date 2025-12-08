import { getIssueByIdFacade } from '@/modules/issue/facade';

import {
	createPictures,
	deletePictureByUrl,
	deletePicturesByIssue,
	getPicturesByIssue,
	updatePictureByUrl
} from './server';
import { type IssuePictureValuesSchema } from './schema';

export const getPicturesByIssueFacade = async (
	issueId: number
): Promise<{ url: string; issueId: number }[]> => {
	const pictures = await getPicturesByIssue(issueId);

	return pictures
		.filter(pic => pic.url)
		.map(pic => ({
			url: pic.url!,
			issueId: pic.issueId
		}));
};

export const createPicturesFacade = async (
	data: IssuePictureValuesSchema[]
) => {
	const pictures = await createPictures(data);
	return pictures
		.filter(pic => pic.url)
		.map(pic => ({
			url: pic.url!,
			issueId: pic.issueId
		}));
};

export const updatePictureFacade = async (
	url: string,
	data: Partial<IssuePictureValuesSchema>
) => {
	const picture = await updatePictureByUrl(url, data);
	const issue = await getIssueByIdFacade(picture.issueId);
	if (!issue) throw new Error(`Issue ${picture.issueId} not found`);

	return {
		...picture,
		url: picture.url!,
		issue
	};
};

export const deletePictureFacade = async (url: string) => {
	await deletePictureByUrl(url);
};

export const deletePicturesByIssueFacade = async (issueId: number) => {
	await deletePicturesByIssue(issueId);
};
