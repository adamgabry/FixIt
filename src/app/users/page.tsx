import { UserList } from '@/modules/user/components/user-list';
import { requireAdmin } from '@/modules/auth/server';

const UsersPage = async () => {
	await requireAdmin();

	return <UserList />;
};

export default UsersPage;
