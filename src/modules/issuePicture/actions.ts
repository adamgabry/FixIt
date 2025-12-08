'use server';

import { deletePictureFacade } from '@/modules/issuePicture/facade';

export const deletePictureAction = async (url: string) =>
	deletePictureFacade(url);
