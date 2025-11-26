import { z } from 'zod';

export const issueSchema = z.object({
    id: z.number(),
    title: z.string().min(1),
    description: z.string().min(1),
    location: z.string().min(1),
    status: z.enum(['OPEN', 'IN_PROGRESS', 'CLOSED']),
    type: z.enum(['BUG', 'FEATURE', 'TASK']),
    pictures: z.string().min(1),
    createdAt: z.date(),
    upddatedAt: z.date(),
    reportedBy: z.number(),
    numberOfUpvotes: z.number(),
});

export type Issue = z.infer<typeof issueSchema>;