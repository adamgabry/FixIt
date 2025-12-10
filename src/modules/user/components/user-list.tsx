'use client';

import { useEffect, useMemo, useState } from 'react';

import { UserCard } from '@/modules/user/components/user-card';
import { Role, type User } from '@/modules/user/schema';

const fetchUsersAndMe = async () => {
	const [usersRes, meRes] = await Promise.all([
		fetch('/api/users'),
		fetch('/api/auth/me')
	]);
	const users: User[] = await usersRes.json();
	const me = meRes.ok ? await meRes.json() : null;
	return { users, me };
};

export const UserList = () => {
	const [users, setUsers] = useState<User[]>([]);
	const [me, setMe] = useState<User | null>(null);
	const [search, setSearch] = useState('');

	useEffect(() => {
		fetchUsersAndMe().then(({ users, me }) => {
			setUsers(users);
			setMe(me);
		});
	}, []);

	const filteredSortedUsers = useMemo(() => {
		let filtered = users;
		if (search.trim()) {
			const q = search.trim().toLowerCase();
			filtered = users.filter(
				u =>
					u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
			);
		}
		// Sort: me first, then admins, then staff, then users
		return filtered.slice().sort((a, b) => {
			if (me) {
				if (a.id === me.id) return -1;
				if (b.id === me.id) return 1;
			}
			const roleOrder = (role: Role) =>
				role === Role.ADMIN ? 1 : role === Role.STAFF ? 2 : 3;
			const diff = roleOrder(a.role) - roleOrder(b.role);
			if (diff !== 0) return diff;
			return a.name.localeCompare(b.name);
		});
	}, [users, me, search]);

	return (
		<div className="p-6 max-w-4xl mx-auto">
			<div className="mb-6 flex items-center gap-3">
				<input
					type="text"
					placeholder="Search users by name or email..."
					value={search}
					onChange={e => setSearch(e.target.value)}
					className="border-2 border-orange-200 rounded-lg px-3 py-2 w-full max-w-xs focus:border-orange-400 focus:outline-none bg-white/80"
				/>
			</div>
			<ul className="space-y-0">
				{filteredSortedUsers.map(user => (
					<li key={user.id}>
						<UserCard
							user={user}
							onRoleUpdated={newRole =>
								setUsers(prev =>
									prev.map(u =>
										u.id === user.id
											? {
													...u,
													role: newRole
											  }
											: u
									)
								)
							}
						/>
					</li>
				))}
			</ul>
		</div>
	);
};
