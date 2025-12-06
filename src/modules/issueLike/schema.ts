import { z } from 'zod/index';

import { userSchema } from '@/modules/user/schema';
import { issueSchema } from '@/modules/issue/schema';

export const issueLikeSchema = z.object({
	user: userSchema,
	issue: issueSchema
});

export type IssueLike = z.infer<typeof issueLikeSchema>;

export const issueLikeValuesSchema = z.object({
	userId: z.number(),
	issueId: z.number()
});

export type IssueLikeValuesSchema = z.infer<typeof issueLikeValuesSchema>;
