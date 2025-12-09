import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth';
import { Role } from '@/modules/user/schema';

export const getSession = async () =>
	await auth.api.getSession({
		headers: await headers()
	});

export const requireAuth = async () => {
	const session = await getSession();

	if (!session) {
		redirect('/login');
	}

	return session;
};

export const requireRoles = async (allowedRoles: Role[]) => {
	const session = await requireAuth();

	if (!allowedRoles.includes(session.user.role as Role)) {
		redirect('/forbidden');
	}

	return session;
};

export const requireAdmin = async () => requireRoles([Role.ADMIN]);

export const requireStaff = async () => requireRoles([Role.STAFF, Role.ADMIN]);

export const hasStaffPermissions = async () => {
	const session = await requireAuth();
	return session.user.role === Role.STAFF || session.user.role === Role.ADMIN;
};
