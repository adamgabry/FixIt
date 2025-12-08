import { headers } from 'next/headers';

import { auth } from '@/lib/auth';

export const getSession = async () =>
	await auth.api.getSession({
		headers: await headers()
	});

export const requireAuth = async() => {
	const session = await getSession();

	if (!session) {
		throw new Error('Unauthorized');
	}

	return session;
};

//TODO: use enums
export const requireRole = async (requiredRole: 'user' | 'staff' | 'admin') => {
	const session = await requireAuth();

	if (session.user.role !== requiredRole) {
		throw new Error('Forbidden: Insufficient permissions');
	}

	return session;
};
