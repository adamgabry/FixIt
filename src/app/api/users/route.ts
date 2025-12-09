import { NextResponse } from 'next/server';

import { getUsersFacade } from '@/modules/user/facade';

export const GET = async () => {
	const users = await getUsersFacade();
	return NextResponse.json(users);
};
