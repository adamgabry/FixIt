import {
	createPictures,
	deletePictureByUrl,
	deletePicturesByIssue,
	getPicturesByIssue
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

export const deletePictureFacade = async (url: string) => {
	await deletePictureByUrl(url);
};

export const deletePicturesByIssueFacade = async (issueId: number) => {
	await deletePicturesByIssue(issueId);
};
