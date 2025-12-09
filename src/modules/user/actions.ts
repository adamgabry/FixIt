'use server';

import { updateUserFacade } from '@/modules/user/facade';
import { type Role } from '@/modules/user/schema';
import { requireAdmin } from '@/modules/auth/server';

export const updateUserAction = async (id: string, role: Role) => {
	await requireAdmin();
	return updateUserFacade(id, role);
};
