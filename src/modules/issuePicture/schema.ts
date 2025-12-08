import { z } from 'zod/index';

import { issueSchema } from '@/modules/issue/schema';

export const issuePictureSchema = z.object({
	url: z.string(),
	issue: issueSchema
});

export type IssuePicture = z.infer<typeof issuePictureSchema>;

export const issuePictureValuesSchema = z.object({
	url: z.string(),
	issueId: z.number()
});

export type IssuePictureValuesSchema = z.infer<typeof issuePictureValuesSchema>;
