import { createAuthClient } from 'better-auth/react';
import { inferAdditionalFields } from 'better-auth/client/plugins';

import { type auth } from '@/lib/auth';
import { Role } from '@/modules/user/schema';

export const authClient = createAuthClient({
	baseURL: process.env.NEXT_PUBLIC_APP_URL!,
	plugins: [inferAdditionalFields<typeof auth>()]
});

export const { signIn, signOut, useSession } = authClient;

export const hasRole = (userRole: Role | undefined, allowedRoles: Role[]) => {
	if (!userRole) return false;
	return allowedRoles.includes(userRole);
};

export const hasStaffPermissions = (userRole: Role | undefined) =>
	hasRole(userRole, [Role.STAFF, Role.ADMIN]);

export const hasAdminPermissions = (userRole: Role | undefined) =>
	hasRole(userRole, [Role.ADMIN]);
