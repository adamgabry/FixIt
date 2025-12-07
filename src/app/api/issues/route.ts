import { type NextRequest, NextResponse } from 'next/server';

import { getIssuesFilteredFacade } from '@/modules/issue/facade';
import { type IssueStatus, type IssueType } from '@/modules/issue/schema';

export const GET = async (req: NextRequest) => {
	const { searchParams } = new URL(req.url);
	const typesParam = searchParams.get('types');
	const statusesParam = searchParams.get('statuses');

	const types = typesParam?.split(',') as IssueType[] | undefined;
	const statuses = statusesParam?.split(',') as IssueStatus[] | undefined;

	const issues = await getIssuesFilteredFacade({ types, statuses });
	return NextResponse.json(issues);
};
