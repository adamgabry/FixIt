'use server';

import { updateUserFacade } from '@/modules/user/facade';
import { type Role } from '@/modules/user/schema';

export const updateUserAction = async (id: string, role: Role) =>
	updateUserFacade(id, role);
