import { NextResponse } from 'next/server';

import { getSession } from '@/modules/auth/server';

export const GET = async () => {
	const session = await getSession();
	if (!session) return NextResponse.json(null, { status: 401 });
	return NextResponse.json(session.user);
};
